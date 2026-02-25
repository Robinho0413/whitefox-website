"use client"

import { LoginForm } from "@/components/forms/LoginForm"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">Connexion admin</h1>
      <LoginForm />
    </div>
  )
}