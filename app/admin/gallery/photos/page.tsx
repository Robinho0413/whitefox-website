import AdminLayout from "@/components/layout/adminLayout"
import CreateSubmitButton from "@/components/forms/CreateSubmitButton"
import DeleteSubmitButton from "@/components/forms/DeleteSubmitButton"
import MultiMediaUploadField from "@/components/forms/MultiMediaUploadField"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { getGalleryPublicUrl } from "@/lib/supabase/storage"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ManagePhotosError =
  | "id"
  | "album-not-found"
  | "validation"
  | "upload"
  | "insert"
  | "delete"

type AlbumRow = {
  id: string
  title: string
}

type AlbumPhotoRow = {
  id: string
  album_id: string
  storage_path: string
  sort_order: number
  created_at: string | null
}

async function requireAdmin() {
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

  return supabase
}

function redirectWithError(albumId: string, error: ManagePhotosError): never {
  redirect(`/admin/gallery/photos?id=${encodeURIComponent(albumId)}&error=${error}`)
}

async function uploadPhotos(formData: FormData) {
  "use server"

  const supabase = await requireAdmin()

  const albumId = String(formData.get("album_id") ?? "").trim()

  if (!albumId) {
    redirect("/admin/gallery")
  }

  const selectedFiles = formData
    .getAll("image_files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (selectedFiles.length === 0) {
    redirectWithError(albumId, "validation")
  }

  const { data: album } = await supabase
    .from("albums")
    .select("id")
    .eq("id", albumId)
    .single<{ id: string }>()

  if (!album) {
    redirectWithError(albumId, "album-not-found")
  }

  const { data: lastPhoto } = await supabase
    .from("album_photos")
    .select("sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>()

  let nextSortOrder = (lastPhoto?.sort_order ?? -1) + 1
  const uploadedPaths: string[] = []
  const rowsToInsert: Array<{ album_id: string; storage_path: string; sort_order: number }> = []

  for (const file of selectedFiles) {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-")
    const randomPart = Math.random().toString(36).slice(2, 8)
    const storagePath = `albums/${albumId}/${Date.now()}-${randomPart}-${safeFileName}`

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("gallery").remove(uploadedPaths)
      }
      redirectWithError(albumId, "upload")
    }

    uploadedPaths.push(storagePath)
    rowsToInsert.push({
      album_id: albumId,
      storage_path: storagePath,
      sort_order: nextSortOrder,
    })
    nextSortOrder += 1
  }

  const { error: insertError } = await supabase
    .from("album_photos")
    .insert(rowsToInsert)

  if (insertError) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("gallery").remove(uploadedPaths)
    }
    redirectWithError(albumId, "insert")
  }

  revalidatePath("/admin/gallery")
  revalidatePath("/admin/gallery/photos")
  redirect(`/admin/gallery/photos?id=${encodeURIComponent(albumId)}`)
}

async function deletePhoto(formData: FormData) {
  "use server"

  const supabase = await requireAdmin()

  const albumId = String(formData.get("album_id") ?? "").trim()
  const photoId = String(formData.get("photo_id") ?? "").trim()

  if (!albumId || !photoId) {
    redirect("/admin/gallery")
  }

  const { data: photo } = await supabase
    .from("album_photos")
    .select("id, storage_path")
    .eq("id", photoId)
    .eq("album_id", albumId)
    .single<{ id: string; storage_path: string }>()

  if (!photo) {
    redirectWithError(albumId, "delete")
  }

  await supabase.storage.from("gallery").remove([photo.storage_path])

  const { error: deleteError } = await supabase
    .from("album_photos")
    .delete()
    .eq("id", photo.id)

  if (deleteError) {
    redirectWithError(albumId, "delete")
  }

  revalidatePath("/admin/gallery")
  revalidatePath("/admin/gallery/photos")
  redirect(`/admin/gallery/photos?id=${encodeURIComponent(albumId)}`)
}

export default async function AdminGalleryPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; error?: ManagePhotosError }>
}) {
  const params = await searchParams
  const albumId = String(params?.id ?? "").trim()
  const error = params?.error

  if (!albumId) {
    redirect("/admin/gallery")
  }

  const supabase = await requireAdmin()

  const { data: album } = await supabase
    .from("albums")
    .select("id, title")
    .eq("id", albumId)
    .single<AlbumRow>()

  if (!album) {
    redirect("/admin/gallery")
  }

  const { data: photos } = await supabase
    .from("album_photos")
    .select("id, album_id, storage_path, sort_order, created_at")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  const photosRows = (photos ?? []) as AlbumPhotoRow[]

  const errorMessageByCode: Record<ManagePhotosError, string> = {
    id: "Identifiant de l'album manquant.",
    "album-not-found": "Album introuvable.",
    validation: "Veuillez sélectionner au moins une image.",
    upload: "Le téléchargement d'au moins une image a échoué.",
    insert: "L'enregistrement des photos en base a échoué.",
    delete: "La suppression de la photo a échoué.",
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Photos de l&apos;album</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {album.title}
            </p>
          </div>
          <Button asChild variant="link" className="font-semibold">
            <Link href="/admin/gallery">Retour aux albums</Link>
          </Button>
        </div>

        {error && errorMessageByCode[error] && (
          <p className="text-sm text-destructive">{errorMessageByCode[error]}</p>
        )}

        <form action={uploadPhotos} className="space-y-3 rounded-lg border p-4">
          <input type="hidden" name="album_id" value={album.id} />
          <label htmlFor="image_files" className="text-sm font-medium">
            Ajouter des photos
          </label>
          <MultiMediaUploadField accept="image/*" />
          <div className="flex justify-end">
            <CreateSubmitButton
              idleText="Uploader les photos"
              pendingText="Upload en cours..."
            />
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {photosRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Aucune photo dans cet album pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              photosRows.map((photo) => (
                <TableRow key={photo.id}>
                  <TableCell>
                    <Image
                      width={120}
                      height={80}
                      src={getGalleryPublicUrl(photo.storage_path)}
                      alt="Photo de l'album"
                      className="h-20 w-[120px] rounded-md border object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{photo.sort_order}</TableCell>
                  <TableCell>
                    {photo.created_at
                      ? new Date(photo.created_at).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deletePhoto}>
                      <input type="hidden" name="album_id" value={album.id} />
                      <input type="hidden" name="photo_id" value={photo.id} />
                      <DeleteSubmitButton />
                    </form>
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
