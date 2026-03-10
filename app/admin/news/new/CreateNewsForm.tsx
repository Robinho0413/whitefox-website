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
import { AlertTriangleIcon } from "lucide-react"

type CreateNewsError =
    | "validation"
    | "file"
    | "upload"
    | "public-url"
    | "insert"

type CreateNewsResult =
    | { ok: true }
    | { ok: false; error: CreateNewsError }

type CreateNewsFormProps = {
    newsCount: number
    createNewsAction: (formData: FormData) => Promise<CreateNewsResult>
}

const errorMessageByCode: Record<CreateNewsError, string> = {
    validation: "Veuillez remplir tous les champs obligatoires.",
    file: "Veuillez sélectionner un fichier image valide.",
    upload: "Le téléchargement de l'image a échoué. Vérifiez le bucket/policies Supabase.",
    "public-url": "Impossible de générer l'URL publique de l'image.",
    insert: "L'image est uploadée, mais l'insertion en base a échoué.",
}

export default function CreateNewsForm({ newsCount, createNewsAction }: CreateNewsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formElement = event.currentTarget
        const formData = new FormData(formElement)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Publication de l'actualité en cours...", {
                position: "bottom-right",
            })

            const result = await createNewsAction(formData)

            if (result.ok) {
                toast.success("Actualité publiée avec succès.", {
                    id: loadingToastId,
                    position: "bottom-right",
                })
                router.push("/admin/news")
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
                    <Input id="title" name="title" required placeholder="Titre de l'actualité" />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description de l'actualité"
                        className="min-h-[120px]"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="image_file">Image</FieldLabel>
                    <ImageUploadField />
                </Field>

                <Field>
                    <FieldLabel htmlFor="link_url">URL du lien</FieldLabel>
                    <Input id="link_url" name="link_url" type="url" required placeholder="https://..." />
                    <FieldDescription>
                        Représente le lien vers lequel l’utilisateur sera redirigé en cliquant sur le bouton de l’actualité.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="button_text">Texte du bouton</FieldLabel>
                    <Input id="button_text" name="button_text" defaultValue="En savoir plus" placeholder="En savoir plus" />
                    <FieldDescription>
                        Représente le texte du bouton qui redirigera vers le lien de l&apos;actualité. Par défaut, il est défini sur &quot;En savoir plus&quot;.
                    </FieldDescription>
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/news">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Publication..." : "Publier l'actualité"}
                    </Button>
                    {newsCount >= 5 && (
                        <div className="ml-8 flex items-start gap-2 rounded-md border border-secondary/60 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                            <p>
                                Limite d&apos;actualités atteinte. En publiant cette actualité, la plus ancienne sera automatiquement supprimée.
                            </p>
                        </div>
                    )}
                </Field>
            </FieldGroup>
        </form>
    )
}