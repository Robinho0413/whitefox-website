import AdminLayout from "@/components/layout/adminLayout"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"
import Image from "next/image"

// filepath: c:\Users\robin\Documents\WhiteFox Website\whitefox-website\app\admin\news\page.tsx

type NewsItem = {
    id: string
    image_url: string | null
    title: string | null
    description: string | null
    created_at: string | null
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">Ouvrir le menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 data-[highlighted]:text-red-600 focus:bg-destructive/20 data-[highlighted]:bg-destructive/20">
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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