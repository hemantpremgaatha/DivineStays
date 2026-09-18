import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  question: z.string().trim().min(2).max(300).optional(),
  answer: z.string().trim().min(2).max(2000).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const faq = await prisma.faq.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.faq.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
