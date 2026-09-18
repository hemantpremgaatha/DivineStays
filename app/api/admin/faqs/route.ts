import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  propertyId: z.string().trim().min(1),
  question: z.string().trim().min(2).max(300),
  answer: z.string().trim().min(2).max(2000),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const faq = await prisma.faq.create({ data: parsed.data }).catch(() => null);
  if (!faq) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  return NextResponse.json({ ok: true, id: faq.id }, { status: 201 });
}
