import Link from "next/link"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { logAdminActivity } from "@/lib/admin-activity-log"
import CreateSponsorsForm from "./CreateSponsorsForm"

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

type CreateSponsorsResult =
    | { ok: true }
    | { ok: false; error: CreateSponsorsError }

async function createSponsors(formData: FormData): Promise<CreateSponsorsResult> {
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
        return { ok: false, error: "validation" }
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
        return { ok: false, error: "file" }
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
        return { ok: false, error: "upload" }
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("sponsors-images").getPublicUrl(filePath)

    if (!publicUrl) {
        return { ok: false, error: "public-url" }
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
        return { ok: false, error: "insert" }
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
    return { ok: true }
}

export default async function NewAdminSponsorsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: CreateSponsorsError }>
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
                    <h2 className="text-2xl font-bold">Ajouter un sponsor</h2>
                    <Button asChild variant="link" className="font-semibold">
                        <Link href="/admin/sponsors">Retour</Link>
                    </Button>
                </div>

                {error && (
                    <p className="text-sm text-destructive">
                        Une erreur est survenue lors d&apos;une tentative précédente. Réessayez la publication.
                    </p>
                )}

                <CreateSponsorsForm createSponsorsAction={createSponsors} />
            </div>
        </AdminLayout>
    )
}
