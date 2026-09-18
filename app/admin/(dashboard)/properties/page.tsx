import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Properties</h1>
        <Link href="/admin/properties/new" className="rounded-full bg-[#1b1a18] px-4 py-2 text-sm font-semibold text-white">
          New property
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e7e0d4] bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-[#e7e0d4] text-xs uppercase text-[#8a8378]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-[#f0ece2] last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.area}</td>
                <td className="px-4 py-3">{p.isPublished ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/properties/${p.id}`} className="text-xs font-semibold text-[#c9953d] underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
