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

type CreateSponsorsError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type CreateSponsorsResult =
    | { ok: true }
    | { ok: false; error: CreateSponsorsError }

type CreateSponsorsFormProps = {
    createSponsorsAction: (formData: FormData) => Promise<CreateSponsorsResult>
}

const errorMessageByCode: Record<CreateSponsorsError, string> = {
    validation: "Veuillez remplir tous les champs obligatoires.",
    file: "Veuillez sélectionner un fichier image valide.",
    upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
    "public-url": "Impossible de générer l'URL publique de l'image.",
    insert: "L'image est uploadée, mais l'insertion en base a échoué.",
}

export default function CreateSponsorsForm({ createSponsorsAction }: CreateSponsorsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Publication du sponsor en cours...", {
                position: "bottom-right",
            })

            const result = await createSponsorsAction(formData)

            if (result.ok) {
                toast.success("Sponsor publié avec succès.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
                router.push("/admin/sponsors")
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
                    <Input id="title" name="title" required placeholder="Nom du sponsor" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description du sponsor"
                        className="min-h-[120px]"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="adress">Adresse</FieldLabel>
                    <Input id="adress" name="adress" required placeholder="Adresse du sponsor" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="image_file">Image</FieldLabel>
                    <ImageUploadField />
                </Field>

                <Field>
                    <FieldLabel htmlFor="btn_url">URL du lien</FieldLabel>
                    <Input id="btn_url" name="btn_url" type="url" required placeholder="https://..." />
                    <FieldDescription>
                        Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton du sponsor.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="btn_text">Texte du bouton</FieldLabel>
                    <Input id="btn_text" name="btn_text" defaultValue="En savoir plus" placeholder="En savoir plus" />
                    <FieldDescription>
                        Représente le texte du bouton qui redirigera vers le lien du sponsor. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                    </FieldDescription>
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/sponsors">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Publication..." : "Publier le sponsor"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}