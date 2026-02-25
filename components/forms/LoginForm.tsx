"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export function LoginForm() {
    const supabase = createClient()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage("")

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMessage(error.message)
            setLoading(false)
            return
        }

        router.refresh()
        router.push("/admin")
    }

    const handleReset = () => {
        setEmail("")
        setPassword("")
        setErrorMessage("")
        setLoading(false)
        setShowPassword(false)
    }

    return (
        <form onSubmit={handleLogin} onReset={handleReset} className="w-full">
            <FieldGroup>
                <Field className="max-w-sm">
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            id="fieldgroup-email"
                            type="email"
                            placeholder="adresse@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </InputGroup>
                </Field>
                <Field className="max-w-sm">
                    <FieldLabel htmlFor="inline-end-input">Mot de passe</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            id="inline-end-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrez votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                size="icon-xs"
                                variant="ghost"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
                <Field orientation="horizontal">
                    <Button type="reset" variant="outline">
                        Réinitialiser
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
