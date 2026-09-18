import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  propertyId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(2).max(1000),
  discountText: z.string().trim().min(1).max(80),
  isActive: z.boolean().default(true),
  validUntil: z.string().trim().min(1).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { validUntil, ...rest } = parsed.data;
  const offer = await prisma.offer
    .create({ data: { ...rest, validUntil: validUntil ? new Date(validUntil) : null } })
    .catch(() => null);
  if (!offer) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  return NextResponse.json({ ok: true, id: offer.id }, { status: 201 });
}
