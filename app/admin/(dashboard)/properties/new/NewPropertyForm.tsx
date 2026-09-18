"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPropertyForm() {
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
          const res = await fetch("/api/admin/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: data.get("slug"),
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
              priceMin: data.get("priceMin") || undefined,
              priceMax: data.get("priceMax") || undefined,
              mapQuery: data.get("mapQuery"),
              isPublished: data.get("isPublished") === "on",
            }),
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || "Something went wrong");
          }
          const { id } = await res.json();
          router.push(`/admin/properties/${id}`);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setSubmitting(false);
        }
      }}
      className="mt-6 max-w-xl space-y-3"
    >
      <input name="slug" required placeholder="URL slug (e.g. divine-residency-f16)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <input name="name" required placeholder="Property name" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <input name="address" required placeholder="Full address" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <div className="grid grid-cols-2 gap-3">
        <input name="area" required placeholder="Area" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
        <input name="near" required placeholder="Near (e.g. Allen Samyak)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      </div>
      <input name="tag" required placeholder="Tag (e.g. Boys PG)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <textarea name="description" required placeholder="Description" rows={4} className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <input name="features" placeholder="Features, comma-separated (WiFi, AC, Food included)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <div className="grid grid-cols-2 gap-3">
        <input name="priceMin" type="number" min={1} placeholder="Price min (₹/month)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
        <input name="priceMax" type="number" min={1} placeholder="Price max (₹/month)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      </div>
      <input name="mapQuery" required placeholder="Map search query (usually the address)" className="w-full rounded-xl border border-[#e7e0d4] px-4 py-3" />
      <label className="flex items-center gap-2 text-sm">
        <input name="isPublished" type="checkbox" defaultChecked /> Published (visible on the public site)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={submitting} className="rounded-full bg-[#1b1a18] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {submitting ? "Saving…" : "Create property"}
      </button>
    </form>
  );
}
