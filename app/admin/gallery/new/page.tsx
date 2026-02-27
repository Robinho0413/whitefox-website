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
import CreateSubmitButton from "@/components/forms/CreateSubmitButton"

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

function redirectWithError(error: CreateAlbumError): never {
    redirect(`/admin/gallery/new?error=${error}`)
}

async function createAlbum(formData: FormData) {
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
        redirectWithError("validation")
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        redirectWithError("file")
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
        redirectWithError("upload")
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(filePath)

    if (!publicUrl) {
        redirectWithError("public-url")
    }

    const { error } = await supabase.from("albums").insert({
        title,
        description,
        cover_image: publicUrl,
    })

    if (error) {
        await supabase.storage.from("gallery").remove([filePath])
        redirectWithError("insert")
    }

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
    redirect("/admin/gallery")
}

export default async function NewAdminGalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateAlbumError }>
}) {
    const params = await searchParams
    const error = params?.error

    const errorMessageByCode: Record<CreateAlbumError, string> = {
        validation: "Veuillez remplir tous les champs obligatoires.",
        file: "Veuillez sélectionner un fichier image valide.",
        upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
        "public-url": "Impossible de générer l'URL publique de l'image.",
        insert: "L'image est uploadée, mais l'insertion en base a échoué.",
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

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ajouter un album</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/gallery">Retour</Link>
                    </Button>
                </div>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
                    </p>
                )}

                <form action={createAlbum}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Titre de l'album" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description de l'album"
                                className="min-h-[120px]"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <ImageUploadField />
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/gallery">Annuler</Link>
                            </Button>
                            <CreateSubmitButton idleText="Ajouter l'album" />
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
