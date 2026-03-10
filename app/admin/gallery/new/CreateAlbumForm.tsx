"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import ImageUploadField from "@/components/forms/ImageUploadField"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type CreateAlbumError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type CreateAlbumResult =
    | { ok: true; albumId: string }
    | { ok: false; error: CreateAlbumError }

type CreateAlbumFormProps = {
    createAlbumAction: (formData: FormData) => Promise<CreateAlbumResult>
}

const errorMessageByCode: Record<CreateAlbumError, string> = {
    validation: "Veuillez remplir tous les champs obligatoires.",
    file: "Veuillez sélectionner un fichier image valide.",
    upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
    "public-url": "Impossible de générer l'URL publique de l'image.",
    insert: "L'image est uploadée, mais l'insertion en base a échoué.",
}

export default function CreateAlbumForm({ createAlbumAction }: CreateAlbumFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Création de l'album en cours...", {
                position: "bottom-right",
            })

            const result = await createAlbumAction(formData)

            if (result.ok) {
                toast.success("Album créé avec succès.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
                router.push(`/admin/gallery/photos?id=${encodeURIComponent(result.albumId)}`)
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
            <FieldGroup>
                {inlineError && (
                    <p className="text-sm text-destructive">
                        {inlineError}
                    </p>
                )}

                <Field>
                    <FieldLabel htmlFor="title">Titre</FieldLabel>
                    <Input id="title" name="title" required placeholder="Titre de l'album" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description de l'album"
                        className="min-h-[120px]"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="image_file">Image</FieldLabel>
                    <ImageUploadField />
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/gallery">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Création..." : "Ajouter l'album"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}