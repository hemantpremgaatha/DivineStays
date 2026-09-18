"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Offer = {
  id: string;
  title: string;
  description: string;
  discountText: string;
  isActive: boolean;
};

export default function OffersManager({ propertyId, offers }: { propertyId: string; offers: Offer[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function addOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const data = new FormData(e.currentTarget);
    await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        title: data.get("title"),
        description: data.get("description"),
        discountText: data.get("discountText"),
      }),
    }).catch(() => {});
    formRef.current?.reset();
    setAdding(false);
    router.refresh();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    }).catch(() => {});
    router.refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  }

  return (
    <div>
      <div className="space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="rounded-xl border border-[#e7e0d4] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {offer.title} · <span className="gold">{offer.discountText}</span>
              </p>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={offer.isActive} onChange={(e) => toggleActive(offer.id, e.target.checked)} /> Active
                </label>
                <button onClick={() => remove(offer.id)} className="text-red-600 underline">
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-[#6f6a61]">{offer.description}</p>
          </div>
        ))}
        {offers.length === 0 && <p className="text-sm text-[#8a8378]">No offers yet.</p>}
      </div>

      <form ref={formRef} onSubmit={addOffer} className="mt-4 grid gap-2 rounded-xl border border-dashed border-[#e7e0d4] p-4 sm:grid-cols-3">

        <input name="title" required placeholder="Offer title" className="rounded-lg border border-[#e7e0d4] px-3 py-2 text-sm" />
        <input name="discountText" required placeholder="Discount text (e.g. ₹500 off)" className="rounded-lg border border-[#e7e0d4] px-3 py-2 text-sm" />
        <input name="description" required placeholder="Description" className="rounded-lg border border-[#e7e0d4] px-3 py-2 text-sm" />
        <button disabled={adding} className="sm:col-span-3 rounded-lg bg-[#1b1a18] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {adding ? "Adding…" : "Add offer"}
        </button>
      </form>
    </div>
  );
}
