import AdminLayout from "@/components/layout/adminLayout"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Bienvenue dans le backoffice</h2>
      <p>Vous êtes connecté en tant qu’admin.</p>
    </AdminLayout>
  )
}