import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import NewsActionsMenu from "@/components/ui/NewsActionsMenu"
import { logAdminActivity } from "@/lib/admin-activity-log"

type SponsorsItem = {
    id: string
    title: string | null
    adress: string | null
    description: string | null
    image_url: string | null
    btn_url: string | null
    btn_text: string | null
    created_at: string | null
}

async function deleteSponsor(sponsorId: string) {
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

    // Récupérer l'URL de l'image pour la supprimer du storage
    const { data: sponsors } = await supabase
        .from("sponsors")
        .select("title, image_url")
        .eq("id", sponsorId)
        .single()

    // Supprimer l'image du storage si elle existe
    if (sponsors?.image_url) {
        try {
            // Extraire le chemin du fichier de l'URL publique
            const url = new URL(sponsors.image_url)
            const pathParts = url.pathname.split("/")
            const filePath = pathParts.slice(-2).join("/") // Récupère "sponsors/filename"

            await supabase.storage
                .from("sponsors-images")
                .remove([filePath])
        } catch (error) {
            console.error("Erreur lors de la suppression de l'image:", error)
        }
    }

    // Supprimer le sponsor de la base de données
    const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", sponsorId)

    if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`)
    }

    await logAdminActivity(supabase, {
        actionType: "delete",
        entityType: "sponsors",
        entityId: sponsorId,
        actorId: user.id,
        titleSnapshot: sponsors?.title ?? null,
    })

    revalidatePath("/admin/sponsors")
}

export default async function AdminSponsorsPage() {
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
        .select("*")
        .order("created_at", { ascending: false })

    const sponsorsRows: SponsorsItem[] = (sponsors ?? []) as SponsorsItem[]
    const sponsorsCount = sponsorsRows.length

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gestion des sponsors</h2>
                    <Button asChild variant="default" size="default" className="text-base p-5 font-semibold">
                        <Link href="/admin/sponsors/new">Ajouter un sponsor</Link>
                    </Button>
                </div>

                <div className="flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                    <p>
                        Nombres de sponsors : {sponsorsCount}
                    </p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sponsorsRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    Aucun sponsor disponible.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sponsorsRows.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.image_url ? (
                                            <Image
                                                width={120}
                                                height={80}
                                                src={item.image_url}
                                                alt="image"
                                                objectFit='cover'
                                                className="rounded-md border"
                                            />
                                        ) : (
                                            <div className="h-20 w-[120px] p-1 rounded-md border bg-muted text-muted-foreground text-xs flex items-center justify-center">
                                                Aucune image
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[260px] truncate">
                                        {item.title || "Sans titre"}
                                    </TableCell>
                                    <TableCell className="max-w-[420px] truncate">
                                        {item.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleDateString("fr-FR")
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <NewsActionsMenu newsId={item.id} editHref={`/admin/sponsors/edit?id=${item.id}`} onDelete={deleteSponsor} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    )
}