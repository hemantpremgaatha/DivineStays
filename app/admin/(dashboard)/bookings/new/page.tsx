import { prisma } from "@/lib/prisma";
import NewBookingForm from "./NewBookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>;
}) {
  const { leadId } = await searchParams;

  const [properties, lead] = await Promise.all([
    prisma.property.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true, area: true } }),
    leadId ? prisma.lead.findUnique({ where: { id: leadId } }) : Promise.resolve(null),
  ]);

  return (
    <div>
      <h1 className="serif text-3xl">New booking</h1>
      {lead && <p className="mt-2 text-sm text-[#8a8378]">Converting lead from {lead.name}.</p>}
      <NewBookingForm
        properties={properties}
        leadId={lead?.id}
        defaults={
          lead
            ? {
                guestName: lead.name,
                guestPhone: lead.phone,
                propertyId: lead.propertyId ?? undefined,
                roomType: lead.roomType ?? undefined,
                moveInDate: lead.moveInDate ? lead.moveInDate.toISOString().slice(0, 10) : undefined,
              }
            : undefined
        }
      />
    </div>
  );
}
