import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { logAdminActivity } from "@/lib/admin-activity-log"
import CreateAlbumForm from "./CreateAlbumForm"

type CreateAlbumError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type AlbumRow = {
    id: string
    cover_image: string | null
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
    const bucketMarker = "/gallery/"
    const markerIndex = publicUrl.indexOf(bucketMarker)

    if (markerIndex === -1) {
        return null
    }

    const path = publicUrl.slice(markerIndex + bucketMarker.length)
    return path || null
}

type CreateAlbumResult =
    | { ok: true; albumId: string }
    | { ok: false; error: CreateAlbumError }

async function createAlbum(formData: FormData): Promise<CreateAlbumResult> {
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

    if (!title || !description) {
        return { ok: false, error: "validation" }
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        return { ok: false, error: "file" }
    }

    const validImageFile = imageFile as File

    const safeFileName = validImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filePath = `gallery/${Date.now()}-${safeFileName}`

    const { error: uploadError } = await supabase.storage
        .from("gallery")
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
    } = supabase.storage.from("gallery").getPublicUrl(filePath)

    if (!publicUrl) {
        return { ok: false, error: "public-url" }
    }

    const { data: createdAlbum, error } = await supabase
        .from("albums")
        .insert({
            title,
            description,
            cover_image: publicUrl,
            created_by: user.id,
        })
        .select("id")
        .single<{ id: string }>()

    if (error || !createdAlbum?.id) {
        await supabase.storage.from("gallery").remove([filePath])
        return { ok: false, error: "insert" }
    }

    await logAdminActivity(supabase, {
        actionType: "create",
        entityType: "album",
        entityId: createdAlbum.id,
        actorId: user.id,
        titleSnapshot: title,
    })

    const { data: allAlbumsRows } = await supabase
        .from("albums")
        .select("id, cover_image")
        .order("created_at", { ascending: false })

    const rows = (allAlbumsRows ?? []) as AlbumRow[]
    const rowsToDelete = rows.slice(5)

    if (rowsToDelete.length > 0) {
        const idsToDelete = rowsToDelete.map((item) => item.id)

        await supabase
            .from("albums")
            .delete()
            .in("id", idsToDelete)

        const imagePathsToDelete = rowsToDelete
            .map((item) => item.cover_image)
            .filter((url): url is string => Boolean(url))
            .map((url) => getStoragePathFromPublicUrl(url))
            .filter((path): path is string => Boolean(path))

        if (imagePathsToDelete.length > 0) {
            await supabase.storage.from("gallery").remove(imagePathsToDelete)
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/gallery")
    revalidatePath("/admin/gallery/photos")
    return { ok: true, albumId: createdAlbum.id }
}

export default async function NewAdminGalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateAlbumError }>
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

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ajouter un album</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/gallery">Retour</Link>
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-destructive">
                        Une erreur est survenue lors d&apos;une tentative précédente. Réessayez la création.
                    </p>
                )}

                <CreateAlbumForm createAlbumAction={createAlbum} />
            </div>
        </AdminLayout>
    )
}
