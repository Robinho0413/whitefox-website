"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type EditSubmitButtonProps = {
  idleText: string
  pendingText?: string
}

export default function EditSubmitButton({
  idleText,
  pendingText = "Enregistrement...",
}: EditSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
