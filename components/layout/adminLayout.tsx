import LogoutButton from "../ui/loggoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex mt-16">
            <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
                <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
                <nav className="flex-1 space-y-4 mb-8">
                    <a href="/admin" className="block px-4 py-2 rounded hover:bg-primary/10">
                        Dashboard
                    </a>
                    <a href="/admin/news" className="block px-4 py-2 rounded hover:bg-primary/10">
                        Actualités
                    </a>
                    <a href="/admin/gallery" className="block px-4 py-2 rounded hover:bg-primary/10">
                        Galeries
                    </a>
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