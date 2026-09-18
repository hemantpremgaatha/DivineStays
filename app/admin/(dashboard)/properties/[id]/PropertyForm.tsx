"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Property = {
  id: string;
  name: string;
  address: string;
  area: string;
  near: string;
  tag: string;
  description: string;
  features: string[];
  priceMin: number | null;
  priceMax: number | null;
  mapQuery: string;
  isPublished: boolean;
};

export default function PropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSaved(false);
        const data = new FormData(e.currentTarget);
        try {
          const res = await fetch(`/api/admin/properties/${property.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.get("name"),
              address: data.get("address"),
              area: data.get("area"),
              near: data.get("near"),
              tag: data.get("tag"),
              description: data.get("description"),
              features: String(data.get("features") ?? "")
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean),
              priceMin: data.get("priceMin") || null,
              priceMax: data.get("priceMax") || null,
              mapQuery: data.get("mapQuery"),
              isPublished: data.get("isPublished") === "on",
            }),
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || "Something went wrong");
          }
          setSaved(true);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setSubmitting(false);
        }
      }}
      className="max-w-xl space-y-3"
    >
      <input name="name" required defaultValue={property.name} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <input name="address" required defaultValue={property.address} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <div className="grid grid-cols-2 gap-3">
        <input name="area" required defaultValue={property.area} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
        <input name="near" required defaultValue={property.near} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      </div>
      <input name="tag" required defaultValue={property.tag} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <textarea name="description" required defaultValue={property.description} rows={4} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <input
        name="features"
        defaultValue={property.features.join(", ")}
        placeholder="Features, comma-separated"
        className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3"
      />
      <div className="grid grid-cols-2 gap-3">
        <input name="priceMin" type="number" min={1} defaultValue={property.priceMin ?? ""} placeholder="Price min" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
        <input name="priceMax" type="number" min={1} defaultValue={property.priceMax ?? ""} placeholder="Price max" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      </div>
      <input name="mapQuery" required defaultValue={property.mapQuery} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <label className="flex items-center gap-2 text-sm">
        <input name="isPublished" type="checkbox" defaultChecked={property.isPublished} /> Published (visible on the public site)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Saved.</p>}
      <button disabled={submitting} className="rounded-full bg-[#1b1a18] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {submitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
