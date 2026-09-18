"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Property = { id: string; name: string; area: string };

export default function NewBookingForm({
  properties,
  leadId,
  defaults,
}: {
  properties: Property[];
  leadId?: string;
  defaults?: { guestName?: string; guestPhone?: string; propertyId?: string; roomType?: string; moveInDate?: string };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const data = new FormData(e.currentTarget);
        try {
          const res = await fetch("/api/admin/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId,
              propertyId: data.get("propertyId"),
              guestName: data.get("guestName"),
              guestPhone: data.get("guestPhone"),
              roomType: data.get("roomType"),
              moveInDate: data.get("moveInDate"),
              durationMonths: data.get("durationMonths") || undefined,
              agreedPriceMonthly: data.get("agreedPriceMonthly") || undefined,
              notes: data.get("notes") || undefined,
            }),
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || "Something went wrong");
          }
          router.push("/admin/bookings");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setSubmitting(false);
        }
      }}
      className="mt-6 max-w-xl space-y-3"
    >
      <input
        name="guestName"
        required
        defaultValue={defaults?.guestName}
        placeholder="Guest name"
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      />
      <input
        name="guestPhone"
        required
        defaultValue={defaults?.guestPhone}
        placeholder="Guest phone"
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      />
      <select
        name="propertyId"
        required
        defaultValue={defaults?.propertyId ?? ""}
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      >
        <option value="" disabled>
          Select property
        </option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.area}
          </option>
        ))}
      </select>
      <select
        name="roomType"
        required
        defaultValue={defaults?.roomType ?? ""}
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      >
        <option value="" disabled>
          Room type
        </option>
        <option value="SINGLE">Single</option>
        <option value="DOUBLE_SHARING">Double sharing</option>
        <option value="TRIPLE_SHARING">Triple sharing</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-[#8a8378]">
          Move-in date
          <input
            name="moveInDate"
            type="date"
            required
            defaultValue={defaults?.moveInDate}
            className="mt-1 w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
          />
        </label>
        <label className="text-xs text-[#8a8378]">
          Duration (months)
          <input name="durationMonths" type="number" min={1} className="mt-1 w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
        </label>
      </div>
      <input
        name="agreedPriceMonthly"
        type="number"
        min={1}
        placeholder="Agreed price / month (₹)"
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      />
      <textarea name="notes" placeholder="Notes (optional)" rows={3} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={submitting}
        className="rounded-full bg-[#1b1a18] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Create booking"}
      </button>
    </form>
  );
}
