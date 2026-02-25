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

async function createNews(formData: FormData) {
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
        redirect("/admin/news/new?error=1")
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        redirect("/admin/news/new?error=1")
    }

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
        redirect("/admin/news/new?error=1")
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(filePath)

    const { error } = await supabase.from("news").insert({
        title,
        description,
        image_url: publicUrl,
        link_url,
        button_text: button_text || "En savoir plus",
    })

    if (error) {
        redirect("/admin/news/new?error=1")
    }

    revalidatePath("/admin/news")
    redirect("/admin/news")
}

export default async function NewAdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    const hasError = params?.error === "1"

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
                    <h2 className="text-2xl font-bold">Ajouter une actualité</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/news">Retour</Link>
                    </Button>
                </div>

                {hasError && (
                    <p className="text-sm text-destructive">
                        Impossible d'ajouter l'actualité. Vérifiez les champs et réessayez.
                    </p>
                )}

                <form action={createNews}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Titre</FieldLabel>
                            <Input id="title" name="title" required placeholder="Titre de l'actualité" />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Description de l'actualité"
                                className="min-h-[120px]"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image_file">Image</FieldLabel>
                            <NewsImageUploadField />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="link_url">URL du lien</FieldLabel>
                            <Input id="link_url" name="link_url" type="url" required placeholder="https://..." />
                            <FieldDescription>
                                Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton de l’actualité.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="button_text">Texte du bouton</FieldLabel>
                            <Input id="button_text" name="button_text" defaultValue="En savoir plus" placeholder="En savoir plus" />
                            <FieldDescription>
                                Représente le texte du bouton qui redirigera vers le lien de l'actualité. Par défaut, il est défini sur "En savoir plus".
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/news">Annuler</Link>
                            </Button>
                            <Button type="submit">Publier l'actualité</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
