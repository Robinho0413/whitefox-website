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
import { logAdminActivity } from "@/lib/admin-activity-log"

type EditSponsorsError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type SponsorsItem = {
    id: string
    title: string | null
    description: string | null
    image_url: string | null
    btn_url: string | null
    btn_text: string | null
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

function redirectWithError(error: EditSponsorsError, sponsorsId?: string): never {
    const idPart = sponsorsId ? `id=${encodeURIComponent(sponsorsId)}&` : ""
    redirect(`/admin/sponsors/edit?${idPart}error=${error}`)
}

async function editSponsors(formData: FormData) {
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

    const sponsorsId = String(formData.get("sponsors_id") ?? "").trim()
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const imageFile = formData.get("image_file")
    const btn_url = String(formData.get("btn_url") ?? "").trim()
    const btn_text = String(formData.get("btn_text") ?? "En savoir plus").trim()

    if (!sponsorsId) {
        redirectWithError("id")
    }

    if (!title || !description || !btn_url) {
        redirectWithError("validation", sponsorsId)
    }

    const { data: existingSponsors } = await supabase
        .from("sponsors")
        .select("image_url")
        .eq("id", sponsorsId)
        .single<{ image_url: string | null }>()

    if (!existingSponsors) {
        redirectWithError("not-found", sponsorsId)
    }

    let nextImageUrl = existingSponsors.image_url
    let uploadedImagePath: string | null = null
    let shouldDeleteOldImage = false

    if (imageFile instanceof File && imageFile.size > 0) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
        const filePath = `sponsors/${Date.now()}-${safeFileName}`

        const { error: uploadError } = await supabase.storage
            .from("sponsors-images")
            .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: imageFile.type,
            })

        if (uploadError) {
            redirectWithError("upload", sponsorsId)
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("sponsors-images").getPublicUrl(filePath)

        if (!publicUrl) {
            redirectWithError("public-url", sponsorsId)
        }

        uploadedImagePath = filePath
        nextImageUrl = publicUrl
        shouldDeleteOldImage = true
    }

    const { error } = await supabase
        .from("sponsors")
        .update({
            title,
            description,
            image_url: nextImageUrl,
            btn_url,
            btn_text: btn_text || "En savoir plus",
        })
        .eq("id", sponsorsId)

    if (error) {
        if (uploadedImagePath) {
            await supabase.storage.from("sponsors-images").remove([uploadedImagePath])
        }
        redirectWithError("update", sponsorsId)
    }

    await logAdminActivity(supabase, {
        actionType: "update",
        entityType: "sponsors",
        entityId: sponsorsId,
        actorId: user.id,
        titleSnapshot: title,
    })

    if (shouldDeleteOldImage && existingSponsors.image_url) {
        const oldImagePath = getStoragePathFromPublicUrl(existingSponsors.image_url)
        if (oldImagePath) {
            await supabase.storage.from("sponsors-images").remove([oldImagePath])
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/sponsors")
    redirect("/admin/sponsors")
}

export default async function EditAdminSponsorsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: EditSponsorsError, id?: string }>
}) {
    const params = await searchParams
    const error = params?.error
    const sponsorsId = String(params?.id ?? "").trim()

    if (!sponsorsId) {
        redirect("/admin/sponsors")
    }

    const errorMessageByCode: Record<EditSponsorsError, string> = {
        id: "Identifiant du sponsor manquant.",
        validation: "Veuillez remplir tous les champs obligatoires.",
        upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
        "public-url": "Impossible de générer l'URL publique de l'image.",
        update: "La mise à jour du sponsor a échoué.",
        "not-found": "Sponsor introuvable.",
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

    const { data: sponsors } = await supabase
        .from("sponsors")
        .select("id, title, description, image_url, btn_url, btn_text")
        .eq("id", sponsorsId)
        .single()

    const sponsorsItem = sponsors as SponsorsItem | null

    if (!sponsorsItem) {
        redirectWithError("not-found", sponsorsId)
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Modifier un sponsor</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/sponsors">Retour</Link>
                    </Button>
                </div>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
                    </p>
                )}

                <form action={editSponsors}>
                    <input type="hidden" name="sponsors_id" value={sponsorsItem.id} />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Nom du sponsor" defaultValue={sponsorsItem.title ?? ""} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description du sponsor"
                                className="min-h-[120px]"
                                defaultValue={sponsorsItem.description ?? ""}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <ImageUploadField required={false} initialImageUrl={sponsorsItem.image_url} />
                            <FieldDescription>
                                Laissez vide pour conserver l&apos;image actuelle.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="btn_url">URL du bouton</FieldLabel>
                            <Input id="btn_url" name="btn_url" type="url" required placeholder="https://..." defaultValue={sponsorsItem.btn_url ?? ""} />
                            <FieldDescription>
                                Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton du sponsor.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="btn_text">Texte du bouton</FieldLabel>
                            <Input id="btn_text" name="btn_text" defaultValue={sponsorsItem.btn_text ?? "En savoir plus"} placeholder="En savoir plus" />
                            <FieldDescription>
                                Représente le texte du bouton qui redirigera vers le lien du sponsor. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/sponsors">Annuler</Link>
                            </Button>
                            <EditSubmitButton idleText="Modifier le sponsor" />
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
