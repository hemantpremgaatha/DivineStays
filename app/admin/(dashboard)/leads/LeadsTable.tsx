"use client";
import { useState } from "react";
import Link from "next/link";

type Lead = {
  id: string;
  name: string;
  phone: string;
  propertyName: string;
  budgetBand: string | null;
  roomType: string | null;
  status: string;
  createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

export default function LeadsTable({ leads: initialLeads }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setSavingId(null);
  }

  if (leads.length === 0) {
    return <p className="text-sm text-[#8a8378]">No leads yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e7e0d4] bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-[#e7e0d4] text-xs uppercase text-[#8a8378]">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Budget</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-[#f0ece2] last:border-0">
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3">{lead.phone}</td>
              <td className="px-4 py-3">{lead.propertyName}</td>
              <td className="px-4 py-3">{lead.budgetBand ?? "—"}</td>
              <td className="px-4 py-3">{lead.roomType ?? "—"}</td>
              <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleString("en-IN")}</td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  disabled={savingId === lead.id}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="rounded-lg border border-[#e7e0d4] px-2 py-1.5 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <Link href={`/admin/bookings/new?leadId=${lead.id}`} className="text-xs font-semibold text-[#c9953d] underline">
                  Create booking
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
