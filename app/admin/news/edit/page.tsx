import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import NewsImageUploadField from "@/components/forms/NewsImageUploadField"
import NewsEditSubmitButton from "@/components/forms/NewsEditSubmitButton"

type EditNewsError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type NewsItem = {
    id: string
    title: string | null
    description: string | null
    image_url: string | null
    link_url: string | null
    button_text: string | null
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

function redirectWithError(error: EditNewsError, newsId?: string): never {
    const idPart = newsId ? `id=${encodeURIComponent(newsId)}&` : ""
    redirect(`/admin/news/edit?${idPart}error=${error}`)
}

async function editNews(formData: FormData) {
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

    const newsId = String(formData.get("news_id") ?? "").trim()
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const imageFile = formData.get("image_file")
    const link_url = String(formData.get("link_url") ?? "").trim()
    const button_text = String(formData.get("button_text") ?? "En savoir plus").trim()

    if (!newsId) {
        redirectWithError("id")
    }

    if (!title || !description || !link_url) {
        redirectWithError("validation", newsId)
    }

    const { data: existingNews } = await supabase
        .from("news")
        .select("image_url")
        .eq("id", newsId)
        .single<{ image_url: string | null }>()

    if (!existingNews) {
        redirectWithError("not-found", newsId)
    }

    let nextImageUrl = existingNews.image_url
    let uploadedImagePath: string | null = null
    let shouldDeleteOldImage = false

    if (imageFile instanceof File && imageFile.size > 0) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")
        const filePath = `news/${Date.now()}-${safeFileName}`

        const { error: uploadError } = await supabase.storage
            .from("news-images")
            .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: imageFile.type,
            })

        if (uploadError) {
            redirectWithError("upload", newsId)
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("news-images").getPublicUrl(filePath)

        if (!publicUrl) {
            redirectWithError("public-url", newsId)
        }

        uploadedImagePath = filePath
        nextImageUrl = publicUrl
        shouldDeleteOldImage = true
    }

    const { error } = await supabase
        .from("news")
        .update({
            title,
            description,
            image_url: nextImageUrl,
            link_url,
            button_text: button_text || "En savoir plus",
        })
        .eq("id", newsId)

    if (error) {
        if (uploadedImagePath) {
            await supabase.storage.from("news-images").remove([uploadedImagePath])
        }
        redirectWithError("update", newsId)
    }

    if (shouldDeleteOldImage && existingNews.image_url) {
        const oldImagePath = getStoragePathFromPublicUrl(existingNews.image_url)
        if (oldImagePath) {
            await supabase.storage.from("news-images").remove([oldImagePath])
        }
    }

    revalidatePath("/")
    revalidatePath("/admin/news")
    redirect("/admin/news")
}

export default async function EditAdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: EditNewsError, id?: string }>
}) {
    const params = await searchParams
    const error = params?.error
    const newsId = String(params?.id ?? "").trim()

    if (!newsId) {
        redirect("/admin/news")
    }

    const errorMessageByCode: Record<EditNewsError, string> = {
        id: "Identifiant de l'actualité manquant.",
        validation: "Veuillez remplir tous les champs obligatoires.",
        upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
        "public-url": "Impossible de générer l'URL publique de l'image.",
        update: "La mise à jour de l'actualité a échoué.",
        "not-found": "Actualité introuvable.",
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

    const { data: news } = await supabase
        .from("news")
        .select("id, title, description, image_url, link_url, button_text")
        .eq("id", newsId)
        .single()

    const newsItem = news as NewsItem | null

    if (!newsItem) {
        redirectWithError("not-found", newsId)
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Modifier une actualité</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/news">Retour</Link>
                    </Button>
                </div>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
                    </p>
                )}

                <form action={editNews}>
                    <input type="hidden" name="news_id" value={newsItem.id} />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Titre de l'actualité" defaultValue={newsItem.title ?? ""} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description de l'actualité"
                                className="min-h-[120px]"
                                defaultValue={newsItem.description ?? ""}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <NewsImageUploadField required={false} initialImageUrl={newsItem.image_url} />
                            <FieldDescription>
                                Laissez vide pour conserver l'image actuelle.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="link_url">URL du lien</FieldLabel>
                            <Input id="link_url" name="link_url" type="url" required placeholder="https://..." defaultValue={newsItem.link_url ?? ""} />
                            <FieldDescription>
                                Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton de l’actualité.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="button_text">Texte du bouton</FieldLabel>
                            <Input id="button_text" name="button_text" defaultValue={newsItem.button_text ?? "En savoir plus"} placeholder="En savoir plus" />
                            <FieldDescription>
                                Représente le texte du bouton qui redirigera vers le lien de l&apos;actualité. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/news">Annuler</Link>
                            </Button>
                            <NewsEditSubmitButton />
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
