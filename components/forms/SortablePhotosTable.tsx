"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { GripVertical } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import DeleteSubmitButton from "@/components/forms/DeleteSubmitButton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getGalleryPublicUrl } from "@/lib/supabase/storage"

type SortablePhotoItem = {
    id: string
    album_id: string
    storage_path: string
    sort_order: number
    created_at: string | null
}

type SortablePhotosTableProps = {
    albumId: string
    photos: SortablePhotoItem[]
    deletePhotoAction: (formData: FormData) => Promise<{ ok: boolean }>
    reorderPhotosAction: (formData: FormData) => Promise<{ ok: boolean }>
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
    const nextItems = [...items]
    const [moved] = nextItems.splice(fromIndex, 1)
    nextItems.splice(toIndex, 0, moved)
    return nextItems
}

export default function SortablePhotosTable({
    albumId,
    photos,
    deletePhotoAction,
    reorderPhotosAction,
}: SortablePhotosTableProps) {
    const [orderedPhotos, setOrderedPhotos] = useState(photos)
    const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null)
    const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
    const [, startReordering] = useTransition()
    const [, startDeleting] = useTransition()
    const emptyDragImageRef = useRef<HTMLImageElement | null>(null)
    const orderedPhotosRef = useRef(orderedPhotos)
    const dragStartOrderRef = useRef<string | null>(null)

    useEffect(() => {
        setOrderedPhotos(photos)
    }, [photos])

    orderedPhotosRef.current = orderedPhotos

    const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>, photoId: string) => {
        setDraggedPhotoId(photoId)
        dragStartOrderRef.current = JSON.stringify(orderedPhotosRef.current.map((photo) => photo.id))

        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", photoId)

        if (!emptyDragImageRef.current) {
            const img = document.createElement("img")
            img.src =
                "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
            emptyDragImageRef.current = img
        }

        if (emptyDragImageRef.current) {
            event.dataTransfer.setDragImage(emptyDragImageRef.current, 0, 0)
        }
    }

    const handleDragOverRow = (event: React.DragEvent<HTMLTableRowElement>, rowIndex: number) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"

        if (!draggedPhotoId) {
            return
        }

        setOrderedPhotos((currentPhotos) => {
            const currentIndex = currentPhotos.findIndex((photo) => photo.id === draggedPhotoId)
            if (currentIndex < 0) {
                return currentPhotos
            }

            let targetIndex = rowIndex

            if (targetIndex < 0) {
                targetIndex = 0
            }

            if (targetIndex > currentPhotos.length - 1) {
                targetIndex = currentPhotos.length - 1
            }

            if (targetIndex === currentIndex) {
                return currentPhotos
            }

            return moveItem(currentPhotos, currentIndex, targetIndex)
        })
    }

    const handleDragOverTableBody = (event: React.DragEvent<HTMLTableSectionElement>) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"

        if (!draggedPhotoId) {
            return
        }

        const bodyRect = event.currentTarget.getBoundingClientRect()
        if (event.clientY >= bodyRect.bottom - 8) {
            setOrderedPhotos((currentPhotos) => {
                const currentIndex = currentPhotos.findIndex((photo) => photo.id === draggedPhotoId)
                if (currentIndex < 0 || currentIndex === currentPhotos.length - 1) {
                    return currentPhotos
                }

                return moveItem(currentPhotos, currentIndex, currentPhotos.length - 1)
            })
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLTableSectionElement>) => {
        event.preventDefault()

        if (!draggedPhotoId) {
            return
        }

        const nextOrderedPhotos = orderedPhotosRef.current
        const currentOrder = JSON.stringify(nextOrderedPhotos.map((photo) => photo.id))

        if (!dragStartOrderRef.current || dragStartOrderRef.current === currentOrder) {
            setDraggedPhotoId(null)
            dragStartOrderRef.current = null
            return
        }

        startReordering(async () => {
            const loadingToastId = toast.loading("Enregistrement de l'ordre...", {
                position: "bottom-right",
            })

            const formData = new FormData()
            formData.set("album_id", albumId)
            formData.set(
                "ordered_photo_ids",
                JSON.stringify(nextOrderedPhotos.map((photo) => photo.id))
            )

            const result = await reorderPhotosAction(formData)

            if (result.ok) {
                toast.success("Ordre des photos enregistré", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
            } else {
                toast.error("La réorganisation n'a pas pu être enregistrée.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
            }
        })

        setDraggedPhotoId(null)
        dragStartOrderRef.current = null
    }

    const handleDragEnd = () => {
        setDraggedPhotoId(null)
        dragStartOrderRef.current = null
    }

    const handleDeleteSubmit = (event: React.FormEvent<HTMLFormElement>, photoId: string) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startDeleting(async () => {
            setDeletingPhotoId(photoId)

            const loadingToastId = toast.loading("Suppression de la photo...", {
                position: "bottom-right",
            })

            const result = await deletePhotoAction(formData)

            if (result.ok) {
                setOrderedPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== photoId))
                toast.success("Photo supprimee.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
            } else {
                toast.error("La suppression de la photo a echoue.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
            }

            setDeletingPhotoId(null)
        })
    }

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                <p>
                    Maintenez l&apos;icône et glissez une ligne pour réorganiser les photos.
                </p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">Déplacer</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Ordre</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody
                    onDragOver={handleDragOverTableBody}
                    onDrop={handleDrop}
                    className={
                        draggedPhotoId
                            ? "[&_button]:pointer-events-none [&_form]:pointer-events-none [&_img]:pointer-events-none"
                            : undefined
                    }
                >
                    {orderedPhotos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                Aucune photo dans cet album pour le moment.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orderedPhotos.map((photo, index) => {
                            return (
                                <TableRow
                                    key={photo.id}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, photo.id)}
                                    onDragOver={(event) => handleDragOverRow(event, index)}
                                    onDragEnd={handleDragEnd}
                                    className={
                                        draggedPhotoId === photo.id
                                            ? "bg-muted/40 ring-2 ring-inset ring-primary-500"
                                            : undefined
                                    }
                                >
                                    <TableCell>
                                        <button
                                            type="button"
                                            className="inline-flex cursor-grab items-center justify-center rounded p-1 text-muted-foreground active:cursor-grabbing"
                                            aria-label="Déplacer la photo"
                                            title="Maintenez et glissez pour réorganiser"
                                        >
                                            <GripVertical className="h-4 w-4" />
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Image
                                            width={120}
                                            height={80}
                                            src={getGalleryPublicUrl(photo.storage_path)}
                                            alt="Photo de l'album"
                                            className="h-20 w-[120px] rounded-md border object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        {photo.created_at
                                            ? new Date(photo.created_at).toLocaleDateString("fr-FR")
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form onSubmit={(event) => handleDeleteSubmit(event, photo.id)}>
                                            <input type="hidden" name="album_id" value={albumId} />
                                            <input type="hidden" name="photo_id" value={photo.id} />
                                            <DeleteSubmitButton
                                                idleText="Supprimer"
                                                pendingText="Suppression..."
                                                disabled={deletingPhotoId === photo.id}
                                            />
                                        </form>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
