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

type EditSponsorsError =
    | "id"
    | "validation"
    | "upload"
    | "public-url"
    | "update"
    | "not-found"

type EditSponsorsResult =
    | { ok: true }
    | { ok: false; error: EditSponsorsError }

type EditSponsorsFormProps = {
    sponsorsId: string
    initialTitle: string
    initialDescription: string
    initialImageUrl: string | null
    initialBtnUrl: string
    initialBtnText: string
    editSponsorsAction: (formData: FormData) => Promise<EditSponsorsResult>
}

const errorMessageByCode: Record<EditSponsorsError, string> = {
    id: "Identifiant du sponsor manquant.",
    validation: "Veuillez remplir tous les champs obligatoires.",
    upload: "Le telechargement de l'image a echoue. Verifiez le bucket/policies Supabase.",
    "public-url": "Impossible de generer l'URL publique de l'image.",
    update: "La mise a jour du sponsor a echoue.",
    "not-found": "Sponsor introuvable.",
}

export default function EditSponsorsForm({
    sponsorsId,
    initialTitle,
    initialDescription,
    initialImageUrl,
    initialBtnUrl,
    initialBtnText,
    editSponsorsAction,
}: EditSponsorsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [inlineError, setInlineError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            setInlineError(null)

            const loadingToastId = toast.loading("Mise a jour du sponsor...", {
                position: "bottom-right",
            })

            const result = await editSponsorsAction(formData)

            if (result.ok) {
                toast.success("Sponsor modifie avec succes.", {
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
            <input type="hidden" name="sponsors_id" value={sponsorsId} />
            <FieldGroup>
                {inlineError && (
                    <p className="text-sm text-destructive">
                        {inlineError}
                    </p>
                )}

                <Field>
                    <FieldLabel htmlFor="title">Titre</FieldLabel>
                    <Input id="title" name="title" required placeholder="Nom du sponsor" defaultValue={initialTitle} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Description du sponsor"
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
                    <FieldLabel htmlFor="btn_url">URL du bouton</FieldLabel>
                    <Input id="btn_url" name="btn_url" type="url" required placeholder="https://..." defaultValue={initialBtnUrl} />
                    <FieldDescription>
                        Represente le lien vers lequel l’utilisateur sera redirige en cliquant sur le bouton du sponsor.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="btn_text">Texte du bouton</FieldLabel>
                    <Input id="btn_text" name="btn_text" defaultValue={initialBtnText} placeholder="En savoir plus" />
                    <FieldDescription>
                        Represente le texte du bouton qui redirigera vers le lien du sponsor. Par defaut, il est defini sur &quot;En savoir plus&quot;.
                    </FieldDescription>
                </Field>

                <Field orientation="horizontal">
                    <Button asChild type="button" variant="outline">
                        <Link href="/admin/sponsors">Annuler</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Modification..." : "Modifier le sponsor"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}