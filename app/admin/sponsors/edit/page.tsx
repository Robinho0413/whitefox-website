import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { logAdminActivity } from "@/lib/admin-activity-log"
import EditSponsorsForm from "./EditSponsorsForm"

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

type EditSponsorsResult =
    | { ok: true }
    | { ok: false; error: EditSponsorsError }

async function editSponsors(formData: FormData): Promise<EditSponsorsResult> {
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
        return { ok: false, error: "id" }
    }

    if (!title || !description || !btn_url) {
        return { ok: false, error: "validation" }
    }

    const { data: existingSponsors } = await supabase
        .from("sponsors")
        .select("image_url")
        .eq("id", sponsorsId)
        .single<{ image_url: string | null }>()

    if (!existingSponsors) {
        return { ok: false, error: "not-found" }
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
            return { ok: false, error: "upload" }
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("sponsors-images").getPublicUrl(filePath)

        if (!publicUrl) {
            return { ok: false, error: "public-url" }
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
        return { ok: false, error: "update" }
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
    return { ok: true }
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
        redirect("/admin/sponsors")
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

                <EditSponsorsForm
                    sponsorsId={sponsorsItem.id}
                    initialTitle={sponsorsItem.title ?? ""}
                    initialDescription={sponsorsItem.description ?? ""}
                    initialImageUrl={sponsorsItem.image_url}
                    initialBtnUrl={sponsorsItem.btn_url ?? ""}
                    initialBtnText={sponsorsItem.btn_text ?? "En savoir plus"}
                    editSponsorsAction={editSponsors}
                />
            </div>
        </AdminLayout>
    )
}
