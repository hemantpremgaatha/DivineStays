import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  address: z.string().trim().min(2).max(300).optional(),
  area: z.string().trim().min(2).max(120).optional(),
  near: z.string().trim().min(2).max(160).optional(),
  tag: z.string().trim().min(1).max(60).optional(),
  description: z.string().trim().min(2).max(4000).optional(),
  features: z.array(z.string().trim().min(1)).optional(),
  priceMin: z.coerce.number().int().positive().nullable().optional(),
  priceMax: z.coerce.number().int().positive().nullable().optional(),
  mapQuery: z.string().trim().min(2).max(300).optional(),
  verified: z.boolean().optional(),
  yearsActive: z.coerce.number().int().positive().nullable().optional(),
  responseTimeText: z.string().trim().max(80).nullable().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const property = await prisma.property.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
