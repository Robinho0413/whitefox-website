"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

export default function NewsEditSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Modifier l&apos;actualité"}
    </Button>
  )
}
