import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(2).max(160),
  address: z.string().trim().min(2).max(300),
  area: z.string().trim().min(2).max(120),
  near: z.string().trim().min(2).max(160),
  tag: z.string().trim().min(1).max(60),
  description: z.string().trim().min(2).max(4000),
  features: z.array(z.string().trim().min(1)).default([]),
  priceMin: z.coerce.number().int().positive().optional(),
  priceMax: z.coerce.number().int().positive().optional(),
  mapQuery: z.string().trim().min(2).max(300),
  verified: z.boolean().default(true),
  yearsActive: z.coerce.number().int().positive().optional(),
  responseTimeText: z.string().trim().max(80).optional(),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const property = await prisma.property
    .create({ data: parsed.data })
    .catch(() => null);
  if (!property) return NextResponse.json({ error: "A property with that slug already exists" }, { status: 409 });

  return NextResponse.json({ ok: true, id: property.id }, { status: 201 });
}
