"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./button";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
            return;
        }

        router.push("/login");
    };

    return (
        <Button onClick={handleLogout} variant={"outline"} size={"default"}>
            Déconnexion
        </Button>
    );
}