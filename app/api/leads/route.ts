import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validation";
import { notifyNewLead } from "@/lib/notify";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { propertyId, moveInDate, ...rest } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      ...rest,
      propertyId: propertyId || null,
      moveInDate: moveInDate ? new Date(moveInDate) : null,
    },
    include: { property: { select: { name: true } } },
  });

  notifyNewLead({
    name: lead.name,
    phone: lead.phone,
    propertyName: lead.property?.name ?? "Any location",
    budgetBand: lead.budgetBand,
    roomType: lead.roomType,
    institute: lead.institute,
    moveInDate: lead.moveInDate ? lead.moveInDate.toLocaleDateString("en-IN") : null,
    source: lead.source,
  });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
