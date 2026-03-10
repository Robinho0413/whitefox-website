"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import ImageUploadField from "@/components/forms/ImageUploadField"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type EditAlbumError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type EditAlbumResult =
    | { ok: true }
    | { ok: false; error: EditAlbumError }

type EditAlbumFormProps = {
    albumId: string
    initialTitle: string
    initialDescription: string
    initialImageUrl: string | null
    editAlbumAction: (formData: FormData) => Promise<EditAlbumResult>
}

const errorMessageByCode: Record<EditAlbumError, string> = {
    id: "Identifiant de l'album manquant.",
    validation: "Veuillez remplir tous les champs obligatoires.",
    upload: "Le telechargement de l'image a echoue. Verifiez le bucket/policies Supabase.",
    "public-url": "Impossible de generer l'URL publique de l'image.",
    update: "La mise a jour de l'album a echoue.",
    "not-found": "Album introuvable.",
}

export default function EditAlbumForm({
    albumId,
    initialTitle,
    initialDescription,
    initialImageUrl,
    editAlbumAction,
}: EditAlbumFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Mise a jour de l'album...", {
                position: "bottom-right",
            })

            const result = await editAlbumAction(formData)

            if (result.ok) {
                toast.success("Album modifie avec succes.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
                router.push("/admin/gallery")
                return
            }

            const message = errorMessageByCode[result.error]
            setInlineError(message)
            toast.error(message, {
                id: loadingToastId,
                position: "bottom-right",
            })
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="album_id" value={albumId} />
            <FieldGroup>
                {inlineError && (
                    <p className="text-sm text-destructive">
                        {inlineError}
                    </p>
                )}

                <Field>
                    <FieldLabel htmlFor="title">Titre</FieldLabel>
                    <Input id="title" name="title" required placeholder="Titre de l'album" defaultValue={initialTitle} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description de l'album"
                        className="min-h-[120px]"
                        defaultValue={initialDescription}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="image_file">Image</FieldLabel>
                    <ImageUploadField required={false} initialImageUrl={initialImageUrl} />
                    <FieldDescription>
                        Laissez vide pour conserver l&apos;image actuelle.
                    </FieldDescription>
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/gallery">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Modification..." : "Modifier l'album"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}