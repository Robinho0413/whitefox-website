import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import ImageUploadField from "@/components/forms/ImageUploadField"
import EditSubmitButton from "@/components/forms/EditSubmitButton"

type EditAlbumError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type AlbumsItem = {
    id: string
    title: string
    description: string
    cover_image: string
    created_at: string | null
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

function redirectWithError(error: EditAlbumError, albumId?: string): never {
    const idPart = albumId ? `id=${encodeURIComponent(albumId)}&` : ""
    redirect(`/admin/gallery/edit?${idPart}error=${error}`)
}

async function editAlbum(formData: FormData) {
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

    const albumId = String(formData.get("album_id") ?? "").trim()
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const imageFile = formData.get("image_file")

    if (!albumId) {
        redirectWithError("id")
    }

    if (!title || !description) {
        redirectWithError("validation", albumId)
    }

    const { data: existingAlbum } = await supabase
        .from("albums")
        .select("cover_image")
        .eq("id", albumId)
        .single<{ cover_image: string | null }>()

    if (!existingAlbum) {
        redirectWithError("not-found", albumId)
    }

    let nextImageUrl = existingAlbum.cover_image
    let uploadedImagePath: string | null = null
    let shouldDeleteOldImage = false

    if (imageFile instanceof File && imageFile.size > 0) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
        const filePath = `gallery/${Date.now()}-${safeFileName}`

        const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: imageFile.type,
            })

        if (uploadError) {
            redirectWithError("upload", albumId)
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("gallery").getPublicUrl(filePath)

        if (!publicUrl) {
            redirectWithError("public-url", albumId)
        }

        uploadedImagePath = filePath
        nextImageUrl = publicUrl
        shouldDeleteOldImage = true
    }

    const { error } = await supabase
        .from("albums")
        .update({
            title,
            description,
            cover_image: nextImageUrl,
        })
        .eq("id", albumId)

    if (error) {
        if (uploadedImagePath) {
            await supabase.storage.from("gallery").remove([uploadedImagePath])
        }
        redirectWithError("update", albumId)
    }

    if (shouldDeleteOldImage && existingAlbum.cover_image) {
        const oldImagePath = getStoragePathFromPublicUrl(existingAlbum.cover_image)
        if (oldImagePath) {
            await supabase.storage.from("gallery").remove([oldImagePath])
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/gallery")
    redirect("/admin/gallery")
}

export default async function EditAdminGalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: EditAlbumError, id?: string }>
}) {
    const params = await searchParams
    const error = params?.error
    const albumId = String(params?.id ?? "").trim()

    if (!albumId) {
        redirect("/admin/gallery")
    }

    const errorMessageByCode: Record<EditAlbumError, string> = {
        id: "Identifiant de l'album manquant.",
        validation: "Veuillez remplir tous les champs obligatoires.",
        upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
        "public-url": "Impossible de générer l'URL publique de l'image.",
        update: "La mise à jour de l'album a échoué.",
        "not-found": "Album introuvable.",
    }

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

    const { data: album } = await supabase
        .from("albums")
        .select("id, title, description, cover_image")
        .eq("id", albumId)
        .single()

    const albumItem = album as AlbumsItem | null

    if (!albumItem) {
        redirectWithError("not-found", albumId)
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Modifier un album</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/gallery">Retour</Link>
                    </Button>
                </div>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
                    </p>
                )}

                <form action={editAlbum}>
                    <input type="hidden" name="album_id" value={albumItem.id} />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Titre de l'album" defaultValue={albumItem.title ?? ""} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description de l'album"
                                className="min-h-[120px]"
                                defaultValue={albumItem.description ?? ""}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <ImageUploadField required={false} initialImageUrl={albumItem.cover_image} />
                            <FieldDescription>
                                Laissez vide pour conserver l&apos;image actuelle.
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/gallery">Annuler</Link>
                            </Button>
                            <EditSubmitButton idleText="Modifier l'album" />
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
