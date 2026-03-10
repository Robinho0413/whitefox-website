import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { AlertTriangleIcon } from "lucide-react"
import { logAdminActivity } from "@/lib/admin-activity-log"
import CreateNewsForm from "./CreateNewsForm"

type CreateNewsError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type NewsRow = {
    id: string
    image_url: string | null
}

type NewsCountRow = {
    id: string
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
    const bucketMarker = "/news-images/"
    const markerIndex = publicUrl.indexOf(bucketMarker)

    if (markerIndex === -1) {
        return null
    }

    const path = publicUrl.slice(markerIndex + bucketMarker.length)
    return path || null
}

type CreateNewsResult =
    | { ok: true }
    | { ok: false; error: CreateNewsError }

async function createNews(formData: FormData): Promise<CreateNewsResult> {
    "use server"

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) {
        redirect("/")
    }

    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const imageFile = formData.get("image_file")
    const link_url = String(formData.get("link_url") ?? "").trim()
    const button_text = String(formData.get("button_text") ?? "En savoir plus").trim()

    if (!title || !description || !link_url) {
        return { ok: false, error: "validation" }
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        return { ok: false, error: "file" }
    }

    const validImageFile = imageFile as File

    const safeFileName = validImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filePath = `news/${Date.now()}-${safeFileName}`

    const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(filePath, validImageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: validImageFile.type,
        })

    if (uploadError) {
        return { ok: false, error: "upload" }
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(filePath)

    if (!publicUrl) {
        return { ok: false, error: "public-url" }
    }

    const { data: createdNews, error } = await supabase
        .from("news")
        .insert({
            title,
            description,
            image_url: publicUrl,
            link_url,
            button_text: button_text || "En savoir plus",
            created_by: user.id,
        })
        .select("id")
        .single<{ id: string }>()

    if (error || !createdNews?.id) {
        await supabase.storage.from("news-images").remove([filePath])
        return { ok: false, error: "insert" }
    }

    await logAdminActivity(supabase, {
        actionType: "create",
        entityType: "news",
        entityId: createdNews.id,
        actorId: user.id,
        titleSnapshot: title,
    })

    const { data: allNewsRows } = await supabase
        .from("news")
        .select("id, image_url")
        .order("created_at", { ascending: false })

    const rows = (allNewsRows ?? []) as NewsRow[]
    const rowsToDelete = rows.slice(5)

    if (rowsToDelete.length > 0) {
        const idsToDelete = rowsToDelete.map((item) => item.id)

        await supabase
            .from("news")
            .delete()
            .in("id", idsToDelete)

        const imagePathsToDelete = rowsToDelete
            .map((item) => item.image_url)
            .filter((url): url is string => Boolean(url))
            .map((url) => getStoragePathFromPublicUrl(url))
            .filter((path): path is string => Boolean(path))

        if (imagePathsToDelete.length > 0) {
            await supabase.storage.from("news-images").remove(imagePathsToDelete)
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/news")
    return { ok: true }
}

export default async function NewAdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateNewsError }>
}) {
    const params = await searchParams
    const error = params?.error

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) {
        redirect("/")
    }

    const { data: currentNewsRows } = await supabase
        .from("news")
        .select("id")

    const newsCount = ((currentNewsRows ?? []) as NewsCountRow[]).length

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ajouter une actualité</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/news">Retour</Link>
                    </Button>
                </div>

                <div className="flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                    <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                    <p>
                        Limite active : {newsCount} / 5 actualités. Si une 6e actualité est publiée, la plus ancienne sera supprimée automatiquement.
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-destructive">
                        Une erreur est survenue lors d'une tentative précédente. Réessayez la publication.
                    </p>
                )}

                <CreateNewsForm newsCount={newsCount} createNewsAction={createNews} />
            </div>
        </AdminLayout>
    )
}
