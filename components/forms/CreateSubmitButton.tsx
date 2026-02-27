"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type CreateSubmitButtonProps = {
  idleText: string
  pendingText?: string
}

export default function CreateSubmitButton({
  idleText,
  pendingText = "Enregistrement...",
}: CreateSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingText : idleText}
    </Button>
  )
}
