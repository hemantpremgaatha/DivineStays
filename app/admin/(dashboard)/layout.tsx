import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f3ea]">
      <header className="border-b border-[#e7e0d4] bg-white">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-semibold">
            Divine<span className="gold">Stays</span> <span className="text-sm font-normal text-[#8a8378]">Admin</span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/bookings">Bookings</Link>
            <Link href="/admin/properties">Properties</Link>
            <Link href="/admin/reviews">Reviews</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="container py-10">{children}</div>
    </div>
  );
}
