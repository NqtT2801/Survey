import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { questionInput } from "@/lib/validators";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (!Number.isFinite(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const parsed = questionInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const d = parsed.data;
  if (d.phase === 2 && d.group !== "Shared") {
    return NextResponse.json(
      { error: "Phase 2 questions must have group = Shared" },
      { status: 400 },
    );
  }
  if (d.phase === 1 && d.group === "Shared") {
    return NextResponse.json(
      { error: "Phase 1 questions must be Control or Treatment, not Shared" },
      { status: 400 },
    );
  }
  const res = await db
    .update(schema.questions)
    .set(d)
    .where(eq(schema.questions.id, id))
    .returning({ id: schema.questions.id });
  if (res.length === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (!Number.isFinite(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await db.delete(schema.questions).where(eq(schema.questions.id, id));
  return NextResponse.json({ ok: true });
}
