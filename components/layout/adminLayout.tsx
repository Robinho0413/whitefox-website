import LogoutButton from "../ui/loggoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 px-4 py-12 md:p-16">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        {/* Onglet pour les differentes sections du backoffice (ex: news, sponsors, etc.) */}
        <LogoutButton />
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}