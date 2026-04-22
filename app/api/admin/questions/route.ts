import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { questionInput } from "@/lib/validators";

export async function POST(req: Request) {
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
  const [row] = await db
    .insert(schema.questions)
    .values(d)
    .returning({ id: schema.questions.id });
  return NextResponse.json({ id: row.id });
}
