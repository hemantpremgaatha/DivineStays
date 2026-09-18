import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  leadId: z.string().trim().min(1).optional(),
  propertyId: z.string().trim().min(1, "Select a property"),
  guestName: z.string().trim().min(2, "Name is too short").max(120),
  guestPhone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  roomType: z.enum(["SINGLE", "DOUBLE_SHARING", "TRIPLE_SHARING"]),
  moveInDate: z.string().trim().min(1, "Move-in date is required"),
  durationMonths: z.coerce.number().int().positive().optional(),
  agreedPriceMonthly: z.coerce.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { leadId, moveInDate, ...rest } = parsed.data;

  const booking = await prisma.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: { ...rest, leadId: leadId || null, moveInDate: new Date(moveInDate) },
    });
    if (leadId) {
      await tx.lead.update({ where: { id: leadId }, data: { status: "CONVERTED" } });
    }
    return created;
  });

  return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
}
