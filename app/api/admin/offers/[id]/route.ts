import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().min(2).max(1000).optional(),
  discountText: z.string().trim().min(1).max(80).optional(),
  isActive: z.boolean().optional(),
  validUntil: z.string().trim().min(1).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { validUntil, ...rest } = parsed.data;
  const offer = await prisma.offer
    .update({
      where: { id },
      data: { ...rest, ...(validUntil !== undefined ? { validUntil: validUntil ? new Date(validUntil) : null } : {}) },
    })
    .catch(() => null);
  if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.offer.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
