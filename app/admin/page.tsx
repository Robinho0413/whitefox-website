import AdminLayout from "@/components/layout/adminLayout"
import UmamiStatsCard from "@/components/admin/UmamiStatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AlertTriangleIcon } from "lucide-react"

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
                    Buckets suivis: {trackedBuckets.join(", ")}
                  </p>
                  <p className="text-sm">
                    Utilise: <span className="font-semibold">{formatBytes(usedStorageBytes)}</span>
                  </p>
                  {remainingStorageBytes !== null ? (
                    <>
                      <p className="text-sm">
                        Restant: <span className="font-semibold">{formatBytes(remainingStorageBytes)}</span>
                      </p>
                      <div className="space-y-1.5 pt-1">
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

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Données analytiques</CardTitle>
            </CardHeader>

            <CardContent>
              <UmamiStatsCard />
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  )
}