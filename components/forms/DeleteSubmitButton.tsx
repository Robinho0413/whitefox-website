"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type DeleteSubmitButtonProps = {
  idleText?: string
  pendingText?: string
  disabled?: boolean
}

export default function DeleteSubmitButton({
  idleText = "Supprimer",
  pendingText = "Suppression...",
  disabled = false,
}: DeleteSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="destructive" disabled={pending || disabled}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
