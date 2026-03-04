"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItem = {
    href: string;
    label: string;
    exact?: boolean;
};

type AdminSidebarNavProps = {
    items: NavItem[];
};

export default function AdminSidebarNav({ items }: AdminSidebarNavProps) {
    const pathname = usePathname();

    return (
        <>
            {items.map((item) => {
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
        </>
    );
}
