import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { and, asc, eq, inArray } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Returns the 20 questions the participant will answer in order.
 * Never includes the right answer.
 */
export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } },
) {
  const sessionId = Number(params.sessionId);
  if (!Number.isFinite(sessionId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.id, sessionId))
    .limit(1);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (session.completedAt) {
    return NextResponse.json(
      { error: "Session already completed" },
      { status: 409 },
    );
  }

  const phase1 = await db
    .select()
    .from(schema.questions)
    .where(
      and(
        eq(schema.questions.phase, 1),
        eq(schema.questions.group, session.group),
      ),
    )
    .orderBy(asc(schema.questions.order));
  const phase2 = await db
    .select()
    .from(schema.questions)
    .where(
      and(eq(schema.questions.phase, 2), eq(schema.questions.group, "Shared")),
    )
    .orderBy(asc(schema.questions.order));

  const strip = (q: (typeof schema.questions.$inferSelect)) => ({
    id: q.id,
    phase: q.phase,
    order: q.order,
    text: q.text,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    recommendation: q.recommendation,
    explanation: q.explanation,
  });

  // Which questions already answered? (so we can resume)
  const existing = await db
    .select()
    .from(schema.answers)
    .where(eq(schema.answers.sessionId, sessionId));
  const answeredIds = new Set(existing.map((a) => a.questionId));

  return NextResponse.json({
    group: session.group,
    questions: [...phase1.map(strip), ...phase2.map(strip)],
    answeredQuestionIds: Array.from(answeredIds),
  });
}
