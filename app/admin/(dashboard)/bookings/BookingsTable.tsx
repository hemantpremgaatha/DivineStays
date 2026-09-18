"use client";
import { useState } from "react";

type Booking = {
  id: string;
  guestName: string;
  guestPhone: string;
  propertyName: string;
  roomType: string;
  moveInDate: string;
  agreedPriceMonthly: number | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["REQUESTED", "CONFIRMED", "CHECKED_IN", "CANCELLED", "COMPLETED"];

export default function BookingsTable({ bookings: initialBookings }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setSavingId(null);
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-[#8a8378]">No bookings yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e7e0d4] bg-white">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-[#e7e0d4] text-xs uppercase text-[#8a8378]">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Move-in</th>
            <th className="px-4 py-3">₹/month</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-[#f0ece2] last:border-0">
              <td className="px-4 py-3 font-medium">{booking.guestName}</td>
              <td className="px-4 py-3">{booking.guestPhone}</td>
              <td className="px-4 py-3">{booking.propertyName}</td>
              <td className="px-4 py-3">{booking.roomType}</td>
              <td className="px-4 py-3">{new Date(booking.moveInDate).toLocaleDateString("en-IN")}</td>
              <td className="px-4 py-3">{booking.agreedPriceMonthly ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={booking.status}
                  disabled={savingId === booking.id}
                  onChange={(e) => updateStatus(booking.id, e.target.value)}
                  className="rounded-lg border border-[#e7e0d4] px-2 py-1.5 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
