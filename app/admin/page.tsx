import AdminLayout from "@/components/layout/adminLayout"
import UmamiStatsCard from "@/components/admin/UmamiStatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertTriangleIcon, ArrowUpRightIcon, ImagesIcon, NewspaperIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

type RecentActivity = {
  id: string
  title_snapshot: string | null
  created_at: string | null
  actor_id: string | null
  entity_type: "news" | "album"
  action_type: "create" | "update" | "delete"
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, first_name")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const trackedBuckets = ["gallery", "news-images"]
  const storageQuotaGb = Number(process.env.SUPABASE_STORAGE_QUOTA_GB ?? 0)
  const storageQuotaBytes = Number.isFinite(storageQuotaGb) && storageQuotaGb > 0
    ? storageQuotaGb * 1024 * 1024 * 1024
    : null

  let usedStorageBytes = 0
  let storageError: string | null = null

  const { data: usageFromRpc, error: usageRpcError } = await supabase.rpc(
    "admin_storage_usage_bytes",
    { bucket_ids: trackedBuckets }
  )

  if (usageRpcError) {
    // Fallback for local/dev setups where the SQL function is not installed yet.
    const { data: storageObjects, error: storageObjectsError } = await supabase
      .schema("storage")
      .from("objects")
      .select("bucket_id, metadata")
      .in("bucket_id", trackedBuckets)

    if (storageObjectsError) {
      storageError = usageRpcError.message
    } else {
      usedStorageBytes = (storageObjects ?? []).reduce((total, obj) => {
        const metadata = obj.metadata as { size?: number } | null
        const fileSize = typeof metadata?.size === "number" ? metadata.size : 0
        return total + fileSize
      }, 0)
    }
  } else {
    usedStorageBytes = Number(usageFromRpc ?? 0)
  }

  const remainingStorageBytes =
    storageQuotaBytes !== null ? Math.max(storageQuotaBytes - usedStorageBytes, 0) : null
  const usagePercent =
    storageQuotaBytes && storageQuotaBytes > 0
      ? Math.min((usedStorageBytes / storageQuotaBytes) * 100, 100)
      : null

  const [{ data: activityLogs, error: activityLogsError }, { data: latestNews }, { data: latestAlbums }] = await Promise.all([
    supabase
      .from("admin_activity_logs")
      .select("id, title_snapshot, created_at, actor_id, entity_type, action_type")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("news")
      .select("id, title, created_at, created_by")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("albums")
      .select("id, title, created_at, created_by")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const [
    { count: newsCount },
    { count: albumsCount },
    { count: photosCount },
    { count: adminsCount },
  ] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase.from("albums").select("id", { count: "exact", head: true }),
    supabase.from("album_photos").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_admin", true),
  ])

  const fallbackActivities: RecentActivity[] = [
    ...((latestNews ?? []) as Array<{ id: string; title: string | null; created_at: string | null; created_by: string | null }>).map((item) => ({
      id: item.id,
      title_snapshot: item.title,
      created_at: item.created_at,
      actor_id: item.created_by,
      entity_type: "news" as const,
      action_type: "create" as const,
    })),
    ...((latestAlbums ?? []) as Array<{ id: string; title: string | null; created_at: string | null; created_by: string | null }>).map((item) => ({
      id: item.id,
      title_snapshot: item.title,
      created_at: item.created_at,
      actor_id: item.created_by,
      entity_type: "album" as const,
      action_type: "create" as const,
    })),
  ]

  const activities: RecentActivity[] = activityLogsError
    ? fallbackActivities
    : ((activityLogs ?? []) as RecentActivity[])

  activities.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })

  const limitedActivities = activities.slice(0, 3)
  const latestActivity = limitedActivities[0]

  const authorIds = Array.from(
    new Set(limitedActivities.map((item) => item.actor_id).filter((id): id is string => Boolean(id)))
  )
  const authorNameById = new Map<string, string>()

  if (authorIds.length > 0) {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, first_name")
      .in("id", authorIds)

      ; (profilesData ?? []).forEach((profileRow) => {
        authorNameById.set(profileRow.id, profileRow.first_name || "Admin inconnu")
      })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Bonjour {profile.first_name} !</h2>
        <div className="flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          <p>Vous êtes connecté en tant qu’administrateur. Veuillez ne pas divulguer vos identifiants de connexion.</p>
        </div>

        <div className="w-full flex space-x-6">

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
              ) : (
                <div className="space-y-2">
                  {limitedActivities.map((activity) => {
                    const isNews = activity.entity_type === "news"
                    const actionLabel =
                      activity.action_type === "create"
                        ? "Création"
                        : activity.action_type === "update"
                          ? "Modification"
                          : "Suppression"
                    const actionIcon =
                      activity.action_type === "create"
                        ? <PlusIcon className="size-3.5" />
                        : activity.action_type === "update"
                          ? <PencilIcon className="size-3.5" />
                          : <Trash2Icon className="size-3.5" />

                    return (
                      <div
                        key={activity.id}
                        className="grid grid-cols-1 gap-2 rounded-md border bg-secondary/20 px-3 py-2 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_5rem_3rem] sm:items-center sm:gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {isNews ? <NewspaperIcon className="size-3.5" /> : <ImagesIcon className="size-3.5" />}
                            <span>{isNews ? "Actualité" : "Album"}</span>
                          </div>
                          <p className="truncate text-sm font-medium">{activity.title_snapshot || "Sans titre"}</p>
                        </div>

                        <div className="sm:text-right">
                          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                            {actionIcon}
                            {actionLabel}
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-muted-foreground truncate">
                            Par <span className="font-semibold text-primary-500">{activity.actor_id ? (authorNameById.get(activity.actor_id) ?? "Admin inconnu") : "Admin inconnu"}</span>
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-xs text-muted-foreground">
                            {activity.created_at
                              ? new Date(activity.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <Link
                            href={isNews ? "/admin/news" : "/admin/gallery"}
                            className="text-xs font-medium text-primary-500 hover:underline"
                          >
                            Ouvrir
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {activityLogsError ? (
                <p className="pt-2 text-xs text-muted-foreground">
                  Journal d&apos;activite non disponible: affichage en mode simplifie (creations uniquement).
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Données analytiques</CardTitle>
            </CardHeader>

            <CardContent>
              <UmamiStatsCard />
            </CardContent>
          </Card>

        </div>
        <div className="flex space-x-6">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    href: "/admin/news/new",
                    label: "Ajouter une actualite",
                    description: "Publier une nouvelle actualite",
                  },
                  {
                    href: "/admin/gallery/new",
                    label: "Ajouter un album",
                    description: "Creer un nouvel album photo",
                  },
                  {
                    href: "/admin/news",
                    label: "Gerer les actualites",
                    description: "Modifier ou supprimer une actualite",
                  },
                  {
                    href: "/",
                    label: "Voir le site public",
                    description: "Verifier le rendu cote visiteurs",
                  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group rounded-md border bg-secondary/20 px-3 py-2 transition-colors hover:bg-secondary/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{action.label}</p>
                      <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Infos utiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-md border bg-secondary/20 p-2">
                  <p className="text-xs text-muted-foreground">Actualites</p>
                  <p className="text-2xl font-semibold leading-tight">{(newsCount ?? 0).toLocaleString("fr-FR")}</p>
                </div>
                <div className="rounded-md border bg-secondary/20 p-2">
                  <p className="text-xs text-muted-foreground">Albums</p>
                  <p className="text-2xl font-semibold leading-tight">{(albumsCount ?? 0).toLocaleString("fr-FR")}</p>
                </div>
                <div className="rounded-md border bg-secondary/20 p-2">
                  <p className="text-xs text-muted-foreground">Photos</p>
                  <p className="text-2xl font-semibold leading-tight">{(photosCount ?? 0).toLocaleString("fr-FR")}</p>
                </div>
                <div className="rounded-md border bg-secondary/20 p-2">
                  <p className="text-xs text-muted-foreground">Admins</p>
                  <p className="text-2xl font-semibold leading-tight">{(adminsCount ?? 0).toLocaleString("fr-FR")}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border px-2 py-1">
                  Journal activités : {activityLogsError ? "indisponible" : "actif"}
                </span>
                <span className="rounded-full border px-2 py-1">
                  Quota storage : {storageQuotaBytes ? "configuré" : "non configuré"}
                </span>
                <span className="rounded-full border px-2 py-1">
                  Dernière activité : {latestActivity?.created_at
                    ? new Date(latestActivity.created_at).toLocaleString("fr-FR")
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Espace de stockage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {storageError ? (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Impossible de lire l&apos;utilisation du storage pour le moment.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verifie que la fonction SQL <code>admin_storage_usage_bytes</code> est bien creee dans Supabase.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Buckets suivis : {trackedBuckets.join(", ")}
                  </p>
                  <p className="text-sm">
                    Utilisé : <span className="font-semibold">{formatBytes(usedStorageBytes)}</span>
                  </p>
                  {remainingStorageBytes !== null ? (
                    <>
                      <p className="text-sm">
                        Restant : <span className="font-semibold">{formatBytes(remainingStorageBytes)}</span>
                      </p>
                      <div className="space-y-1.5 pt-4">
                        <div className="h-2 w-full rounded-full bg-secondary/70 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${(usagePercent ?? 0) >= 90
                              ? "bg-destructive"
                              : (usagePercent ?? 0) >= 75
                                ? "bg-amber-500"
                                : "bg-primary-500"
                              }`}
                            style={{ width: `${usagePercent ?? 0}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(usedStorageBytes)} / {formatBytes(storageQuotaBytes ?? 0)} ({usagePercent?.toFixed(1)}% utilise)
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Ajoute la variable d&apos;environnement <code>SUPABASE_STORAGE_QUOTA_GB</code> pour afficher le stockage restant.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </AdminLayout>
  )
}