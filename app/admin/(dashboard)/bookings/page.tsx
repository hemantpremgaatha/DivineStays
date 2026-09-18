import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BookingsTable from "./BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Bookings</h1>
        <Link href="/admin/bookings/new" className="rounded-full bg-[#1b1a18] px-4 py-2 text-sm font-semibold text-white">
          New booking
        </Link>
      </div>
      <div className="mt-6">
        <BookingsTable
          bookings={bookings.map((b) => ({
            id: b.id,
            guestName: b.guestName,
            guestPhone: b.guestPhone,
            propertyName: b.property.name,
            roomType: b.roomType,
            moveInDate: b.moveInDate.toISOString(),
            agreedPriceMonthly: b.agreedPriceMonthly,
            status: b.status,
            createdAt: b.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
