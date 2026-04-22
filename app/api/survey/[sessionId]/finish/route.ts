import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const body = z.object({
  bet: z.boolean(),
  knowledgeRating: z.number().int().min(1).max(5),
});

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } },
) {
  const sessionId = Number(params.sessionId);
  if (!Number.isFinite(sessionId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, sessionId))
    .limit(1);
  if (!session)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.completedAt)
    return NextResponse.json(
      { error: "Session already completed" },
      { status: 409 },
    );

  await db
    .update(schema.sessions)
    .set({
      bet: parsed.data.bet,
      knowledgeRating: parsed.data.knowledgeRating,
      completedAt: new Date(),
    })
    .where(eq(schema.sessions.id, sessionId));

  return NextResponse.json({ ok: true });
}
