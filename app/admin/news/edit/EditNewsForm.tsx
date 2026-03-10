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

type EditNewsError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type EditNewsResult =
    | { ok: true }
    | { ok: false; error: EditNewsError }

type EditNewsFormProps = {
    newsId: string
    initialTitle: string
    initialDescription: string
    initialImageUrl: string | null
    initialLinkUrl: string
    initialButtonText: string
    editNewsAction: (formData: FormData) => Promise<EditNewsResult>
}

const errorMessageByCode: Record<EditNewsError, string> = {
    id: "Identifiant de l'actualite manquant.",
    validation: "Veuillez remplir tous les champs obligatoires.",
    upload: "Le telechargement de l'image a echoue. Verifiez le bucket/policies Supabase.",
    "public-url": "Impossible de generer l'URL publique de l'image.",
    update: "La mise a jour de l'actualite a echoue.",
    "not-found": "Actualite introuvable.",
}

export default function EditNewsForm({
    newsId,
    initialTitle,
    initialDescription,
    initialImageUrl,
    initialLinkUrl,
    initialButtonText,
    editNewsAction,
}: EditNewsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Mise a jour de l'actualite...", {
                position: "bottom-right",
            })

            const result = await editNewsAction(formData)

            if (result.ok) {
                toast.success("Actualite modifiee avec succes.", {
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
            <input type="hidden" name="news_id" value={newsId} />
            <FieldGroup>
                {inlineError && (
                    <p className="text-sm text-destructive">
                        {inlineError}
                    </p>
                )}

                <Field>
                    <FieldLabel htmlFor="title">Titre</FieldLabel>
                    <Input id="title" name="title" required placeholder="Titre de l'actualite" defaultValue={initialTitle} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description de l'actualite"
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

                <Field>
                    <FieldLabel htmlFor="link_url">URL du lien</FieldLabel>
                    <Input id="link_url" name="link_url" type="url" required placeholder="https://..." defaultValue={initialLinkUrl} />
                    <FieldDescription>
                        Represente le lien vers lequel l’utilisateur sera redirige en cliquant sur le bouton de l’actualite.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="button_text">Texte du bouton</FieldLabel>
                    <Input id="button_text" name="button_text" defaultValue={initialButtonText} placeholder="En savoir plus" />
                    <FieldDescription>
                        Represente le texte du bouton qui redirigera vers le lien de l&apos;actualite. Par defaut, il est defini sur &quot;En savoir plus&quot;.
                    </FieldDescription>
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/news">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Modification..." : "Modifier l'actualite"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}