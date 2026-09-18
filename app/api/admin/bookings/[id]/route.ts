import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["REQUESTED", "CONFIRMED", "CHECKED_IN", "CANCELLED", "COMPLETED"]).optional(),
  agreedPriceMonthly: z.coerce.number().int().positive().optional(),
  durationMonths: z.coerce.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const booking = await prisma.booking.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
