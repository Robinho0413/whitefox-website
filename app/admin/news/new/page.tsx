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
import NewsCreateSubmitButton from "@/components/forms/NewsCreateSubmitButton"
import { AlertTriangleIcon } from "lucide-react"

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

function redirectWithError(error: CreateNewsError): never {
    redirect(`/admin/news/new?error=${error}`)
}

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
        redirectWithError("validation")
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        redirectWithError("file")
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
        redirectWithError("upload")
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(filePath)

    if (!publicUrl) {
        redirectWithError("public-url")
    }

    const { error } = await supabase.from("news").insert({
        title,
        description,
        image_url: publicUrl,
        link_url,
        button_text: button_text || "En savoir plus",
    })

    if (error) {
        await supabase.storage.from("news-images").remove([filePath])
        redirectWithError("insert")
    }

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
    redirect("/admin/news")
}

export default async function NewAdminNewsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateNewsError }>
}) {
    const params = await searchParams
    const error = params?.error

    const errorMessageByCode: Record<CreateNewsError, string> = {
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

                <p className="text-sm text-muted-foreground">
                    Limite active : {newsCount} / 5 actualités. Si une 6e actualité est publiée, la plus ancienne sera supprimée automatiquement.
                </p>

                {error && errorMessageByCode[error] && (
                    <p className="text-sm text-destructive">
                        {errorMessageByCode[error]}
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
                                Représente le texte du bouton qui redirigera vers le lien de l&apos;actualité. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                            </FieldDescription>
                        </Field>

                        <Field orientation="horizontal">
                            <Button asChild type="button" variant="outline">
                                <Link href="/admin/news">Annuler</Link>
                            </Button>
                            <NewsCreateSubmitButton />
                            {newsCount >= 5 && (
                                <div className="flex items-start gap-2 rounded-md ml-8 border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                                    <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                                    <p>
                                        Limite d&apos;actualités atteinte. En publiant cette actualité, la plus ancienne sera automatiquement supprimée.
                                    </p>
                                </div>
                            )}
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </AdminLayout>
    )
}
