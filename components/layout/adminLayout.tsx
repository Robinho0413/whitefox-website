"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import LogoutButton from "../ui/loggoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", exact: true },
        { href: "/admin/news", label: "Actualités" },
        { href: "/admin/gallery", label: "Galeries" },
    ];

    return (
        <div className="flex mt-16">
            <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
                <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
                <nav className="flex-1 space-y-4 mb-8">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "block px-4 py-2 rounded transition-colors hover:bg-primary/10",
                                    isActive && "bg-primary/15 text-primary font-medium"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                    <div className="w-full border-t border-border pt-6">
                        <LogoutButton />
                    </div>
                </nav>

            </aside>

            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}