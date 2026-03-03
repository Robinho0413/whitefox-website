"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type DeleteSubmitButtonProps = {
  idleText?: string
  pendingText?: string
}

export default function DeleteSubmitButton({
  idleText = "Supprimer",
  pendingText = "Suppression...",
}: DeleteSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
