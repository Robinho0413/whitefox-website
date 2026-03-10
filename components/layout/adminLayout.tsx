import { createClient } from "@/lib/supabase/server";
import AdminSidebarNav from "./adminSidebarNav";

import LogoutButton from "../ui/loggoutButton";

const navItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/news", label: "Actualités" },
    { href: "/admin/gallery", label: "Galerie" },
    { href: "/admin/sponsors", label: "Sponsors" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let connectedUserDisplayName = "";

    if (user) {
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("first_name, last_name")
            .eq("id", user.id)
            .maybeSingle();

        const firstName = userProfile?.first_name?.trim() ?? "";
        const lastName = userProfile?.last_name?.trim() ?? "";
        connectedUserDisplayName = `${firstName} ${lastName}`.trim();
    }

    return (
        <div className="flex mt-16">
            <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
                <h1 className="text-xl font-bold mb-8">{connectedUserDisplayName}</h1>
                <nav className="flex-1 space-y-4 mb-8">
                    <AdminSidebarNav items={navItems} />
                    <div className="w-full border-t border-border pt-6">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
    );
}