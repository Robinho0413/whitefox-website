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

type AlbumsItem = {
    id: string
    title: string
    description: string
    cover_image: string
    created_at: string | null
}

async function deleteAlbum(albumId: string) {
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
    const { data: albums } = await supabase
        .from("albums")
        .select("cover_image")
        .eq("id", albumId)
        .single()

    // Supprimer l'image du storage si elle existe
    if (albums?.cover_image) {
        try {
            // Extraire le chemin du fichier de l'URL publique
            const url = new URL(albums.cover_image)
            const pathParts = url.pathname.split("/")
            const filePath = pathParts.slice(-2).join("/") // Récupère "gallery/filename"

            await supabase.storage
                .from("gallery")
                .remove([filePath])
        } catch (error) {
            console.error("Erreur lors de la suppression de l'image:", error)
        }
    }

    // Supprimer l'album de la base de données
    const { error } = await supabase
        .from("albums")
        .delete()
        .eq("id", albumId)

    if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`)
    }

    revalidatePath("/admin/gallery")
}

export default async function AdminAlbumsPage() {
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

    const { data: albums } = await supabase
        .from("albums")
        .select("*")
        .order("created_at", { ascending: false })

    const albumsRows: AlbumsItem[] = (albums ?? []) as AlbumsItem[]
    const albumsCount = albumsRows.length

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gestion des albums</h2>
                    <Button asChild variant="default" size="default" className="text-base p-5 font-semibold">
                        <Link href="/admin/gallery/new">Ajouter un album</Link>
                    </Button>
                </div>

                <div className="flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                    <p>
                        Nombres d'albums : {albumsCount}.
                    </p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cover</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albumsRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    Aucun album disponible.
                                </TableCell>
                            </TableRow>
                        ) : (
                            albumsRows.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.cover_image ? (
                                            <Image
                                                width={120}
                                                height={80}
                                                src={item.cover_image}
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
                                        <NewsActionsMenu newsId={item.id} editHref={`/admin/gallery/edit?id=${item.id}`} onDelete={deleteAlbum} />
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