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
import { logAdminActivity } from "@/lib/admin-activity-log"

type CreateSponsorsError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type SponsorsRow = {
    id: string
    image_url: string | null
}

function getStoragePathFromPublicUrl(publicUrl: string): string | null {
    const bucketMarker = "/sponsors-images/"
    const markerIndex = publicUrl.indexOf(bucketMarker)

    if (markerIndex === -1) {
        return null
    }

    const path = publicUrl.slice(markerIndex + bucketMarker.length)
    return path || null
}

function redirectWithError(error: CreateSponsorsError): never {
    redirect(`/admin/sponsors/new?error=${error}`)
}

async function createSponsors(formData: FormData) {
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
    const adress = String(formData.get("adress") ?? "").trim()
    const imageFile = formData.get("image_file")
    const btn_url = String(formData.get("btn_url") ?? "").trim()
    const btn_text = String(formData.get("btn_text") ?? "En savoir plus").trim()

    if (!title || !description || !adress || !btn_url) {
        redirectWithError("validation")
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        redirectWithError("file")
    }

    const validImageFile = imageFile as File

    const safeFileName = validImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const filePath = `sponsors/${Date.now()}-${safeFileName}`

    const { error: uploadError } = await supabase.storage
        .from("sponsors-images")
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
    } = supabase.storage.from("sponsors-images").getPublicUrl(filePath)

    if (!publicUrl) {
        redirectWithError("public-url")
    }

    const { data: createdSponsors, error } = await supabase
        .from("sponsors")
        .insert({
            title,
            description,
            adress,
            image_url: publicUrl,
            btn_url,
            btn_text: btn_text || "En savoir plus",
            created_by: user.id,
        })
        .select("id")
        .single<{ id: string }>()

    if (error || !createdSponsors?.id) {
        await supabase.storage.from("sponsors-images").remove([filePath])
        redirectWithError("insert")
    }

    await logAdminActivity(supabase, {
        actionType: "create",
        entityType: "sponsors",
        entityId: createdSponsors.id,
        actorId: user.id,
        titleSnapshot: title,
    })

    const { data: allSponsorsRows } = await supabase
        .from("sponsors")
        .select("id, image_url")
        .order("created_at", { ascending: false })

    const sponsors = (allSponsorsRows ?? []) as SponsorsRow[]
    const sponsorsToDelete = sponsors.slice(5)

    if (sponsorsToDelete.length > 0) {
        const idsToDelete = sponsorsToDelete.map((item) => item.id)

        await supabase
            .from("sponsors")
            .delete()
            .in("id", idsToDelete)

        const imagePathsToDelete = sponsorsToDelete
            .map((item) => item.image_url)
            .filter((url): url is string => Boolean(url))
            .map((url) => getStoragePathFromPublicUrl(url))
            .filter((path): path is string => Boolean(path))

        if (imagePathsToDelete.length > 0) {
            await supabase.storage.from("sponsors-images").remove(imagePathsToDelete)
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/sponsors")
    redirect("/admin/sponsors")
}

export default async function NewAdminSponsorsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateSponsorsError }>
}) {
    const params = await searchParams
    const error = params?.error

    const errorMessageByCode: Record<CreateSponsorsError, string> = {
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
                    <h2 className="text-2xl font-bold">Ajouter un sponsor</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/sponsors">Retour</Link>
                    </Button>
                </div>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
                    </p>
                )}

                <form action={createSponsors}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Nom du sponsor" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description du sponsor"
                                className="min-h-[120px]"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="adress">Adresse</FieldLabel>
                            <Input id="adress" name="adress" required placeholder="Adresse du sponsor" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <ImageUploadField />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="btn_url">URL du lien</FieldLabel>
                            <Input id="btn_url" name="btn_url" type="url" required placeholder="https://..." />
                            <FieldDescription>
                                Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton du sponsor.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="btn_text">Texte du bouton</FieldLabel>
                            <Input id="btn_text" name="btn_text" defaultValue="En savoir plus" placeholder="En savoir plus" />
                            <FieldDescription>
                                Représente le texte du bouton qui redirigera vers le lien du sponsor. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/sponsors">Annuler</Link>
                            </Button>
                            <CreateSubmitButton idleText="Publier le sponsor" />
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
