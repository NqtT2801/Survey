import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { and, eq, count } from "drizzle-orm";
import { QUESTIONS_PER_PHASE } from "@/lib/constants";

export const runtime = "nodejs";

async function bucketReady(phase: 1 | 2, group: "Control" | "Treatment" | "Shared") {
  const [{ c }] = await db
    .select({ c: count() })
    .from(schema.questions)
    .where(and(eq(schema.questions.phase, phase), eq(schema.questions.group, group)));
  return c === QUESTIONS_PER_PHASE;
}

export async function POST() {
  // Require that all three buckets exist with exactly QUESTIONS_PER_PHASE items.
  const [p1c, p1t, p2s] = await Promise.all([
    bucketReady(1, "Control"),
    bucketReady(1, "Treatment"),
    bucketReady(2, "Shared"),
  ]);
  if (!(p1c && p1t && p2s)) {
    return NextResponse.json(
      {
        error:
          "Survey is not ready. Each of Phase 1/Control, Phase 1/Treatment, and Phase 2/Shared must contain exactly 10 questions.",
      },
      { status: 409 },
    );
  }

  const group: "Control" | "Treatment" = Math.random() < 0.5 ? "Control" : "Treatment";

  const [row] = await db
    .insert(schema.sessions)
    .values({ group })
    .returning({ id: schema.sessions.id });

  return NextResponse.json({ sessionId: row.id, group });
}
