"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { AlertDialogDeleteConfirm } from "@/components/ui/deleteConfirmation"

interface NewsActionsMenuProps {
  newsId: string
  editHref: string
  onDelete: (newsId: string) => Promise<void>
}

export default function NewsActionsMenu({ newsId, editHref, onDelete }: NewsActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(newsId)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Une erreur s'est produite lors de la suppression.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isLoading}>
            <MoreHorizontalIcon />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={editHref}>Modifier</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsDeleteDialogOpen(true)
            }}
            disabled={isLoading}
            className="text-destructive focus:text-destructive data-[highlighted]:text-destructive focus:bg-destructive/20 data-[highlighted]:bg-destructive/20"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDeleteConfirm
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </>
  )
}
