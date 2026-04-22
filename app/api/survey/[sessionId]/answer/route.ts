import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { answerChoice } from "@/lib/validators";

export const runtime = "nodejs";

const body = z.object({
  questionId: z.number().int().positive(),
  participantAnswer: answerChoice,
  openedBox: z.boolean(),
  timeToAnswerMs: z.number().int().nonnegative().max(24 * 60 * 60 * 1000),
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

  // Verify the question belongs to this session's flow (group/phase match).
  const [q] = await db
    .select()
    .from(schema.questions)
    .where(eq(schema.questions.id, parsed.data.questionId))
    .limit(1);
  if (!q)
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  const belongs =
    (q.phase === 1 && q.group === session.group) ||
    (q.phase === 2 && q.group === "Shared");
  if (!belongs)
    return NextResponse.json(
      { error: "Question does not belong to this session" },
      { status: 400 },
    );

  // Upsert: delete any prior answer for this (session, question) before insert.
  await db
    .delete(schema.answers)
    .where(
      and(
        eq(schema.answers.sessionId, sessionId),
        eq(schema.answers.questionId, parsed.data.questionId),
      ),
    );
  await db.insert(schema.answers).values({
    sessionId,
    questionId: parsed.data.questionId,
    participantAnswer: parsed.data.participantAnswer,
    openedBox: parsed.data.openedBox,
    timeToAnswerMs: parsed.data.timeToAnswerMs,
  });

  return NextResponse.json({ ok: true });
}
