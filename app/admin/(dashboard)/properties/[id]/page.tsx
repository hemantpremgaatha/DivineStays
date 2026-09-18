import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "./PropertyForm";
import OffersManager from "./OffersManager";
import FaqsManager from "./FaqsManager";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      offers: { orderBy: { createdAt: "desc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!property) notFound();

  return (
    <div>
      <h1 className="serif text-3xl">{property.name}</h1>

      <h2 className="serif mt-8 text-xl">Details</h2>
      <div className="mt-4">
        <PropertyForm property={property} />
      </div>

      <h2 className="serif mt-10 text-xl">Offers</h2>
      <div className="mt-4">
        <OffersManager propertyId={property.id} offers={property.offers} />
      </div>

      <h2 className="serif mt-10 text-xl">FAQs</h2>
      <div className="mt-4">
        <FaqsManager propertyId={property.id} faqs={property.faqs} />
      </div>
    </div>
  );
}
