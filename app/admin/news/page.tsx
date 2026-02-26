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

// filepath: c:\Users\robin\Documents\WhiteFox Website\whitefox-website\app\admin\news\page.tsx

type NewsItem = {
    id: string
    image_url: string | null
    title: string | null
    description: string | null
    created_at: string | null
}

async function deleteNews(newsId: string) {
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
    const { data: news } = await supabase
        .from("news")
        .select("image_url")
        .eq("id", newsId)
        .single()

    // Supprimer l'image du storage si elle existe
    if (news?.image_url) {
        try {
            // Extraire le chemin du fichier de l'URL publique
            const url = new URL(news.image_url)
            const pathParts = url.pathname.split("/")
            const filePath = pathParts.slice(-2).join("/") // Récupère "news/filename"

            await supabase.storage
                .from("news-images")
                .remove([filePath])
        } catch (error) {
            console.error("Erreur lors de la suppression de l'image:", error)
        }
    }

    // Supprimer la news de la base de données
    const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", newsId)

    if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`)
    }

    revalidatePath("/admin/news")
}

export default async function AdminNewsPage() {
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
        .select("*")
        .order("created_at", { ascending: false })

    const newsRows: NewsItem[] = (news ?? []) as NewsItem[]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gestion des actualités</h2>
                    <Button asChild variant="default" size="default" className="text-base p-5 font-semibold">
                        <Link href="/admin/news/new">Ajouter une actualité +</Link>
                    </Button>
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
                        {newsRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    Aucune actualité disponible.
                                </TableCell>
                            </TableRow>
                        ) : (
                            newsRows.map((item) => (
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
                                        <NewsActionsMenu newsId={item.id} editHref={`/admin/news/edit?id=${item.id}`} onDelete={deleteNews} />
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