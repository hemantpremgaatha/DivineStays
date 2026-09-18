import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_ORDER = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;
const STATUS_LABELS: Record<(typeof STATUS_ORDER)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  LOST: "Lost",
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function AdminOverviewPage() {
  const [statusCounts, leadsToday, totalLeads, pendingReviews, totalProperties, bookingsByStatus] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday() } } }),
    prisma.lead.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.property.count({ where: { isPublished: true } }),
    prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countByStatus = Object.fromEntries(statusCounts.map((s) => [s.status, s._count._all])) as Record<string, number>;
  const converted = countByStatus.CONVERTED ?? 0;
  const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : "0.0";
  const totalBookings = bookingsByStatus.reduce((sum, b) => sum + b._count._all, 0);

  return (
    <div>
      <h1 className="serif text-3xl">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Link href="/admin/leads" className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{leadsToday}</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Leads today</p>
        </Link>
        <Link href="/admin/leads" className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{totalLeads}</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Total leads</p>
        </Link>
        <div className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{conversionRate}%</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Conversion rate</p>
        </div>
        <Link href="/admin/bookings" className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{totalBookings}</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Total bookings</p>
        </Link>
      </div>

      <h2 className="serif mt-10 text-xl">Lead funnel</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-5">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="rounded-2xl border border-[#e7e0d4] bg-white p-5">
            <p className="text-2xl font-bold">{countByStatus[status] ?? 0}</p>
            <p className="mt-1 text-sm text-[#6f6a61]">{STATUS_LABELS[status]}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/reviews" className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{pendingReviews}</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Reviews pending moderation</p>
        </Link>
        <Link href="/admin/properties" className="rounded-2xl border border-[#e7e0d4] bg-white p-6">
          <p className="text-3xl font-bold">{totalProperties}</p>
          <p className="mt-1 text-sm text-[#6f6a61]">Published properties</p>
        </Link>
      </div>
    </div>
  );
}
