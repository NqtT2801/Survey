import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const body = z.object({
  bankName: z.string().trim().max(200).nullable(),
  bankAccountNumber: z.string().trim().max(100).nullable(),
  bankAccountHolder: z.string().trim().max(200).nullable(),
});

/**
 * Finalises a session: stores bank details (for participants eligible for a
 * payout) and sets completedAt. Must be called after /finish.
 */
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
  if (session.knowledgeRating == null)
    return NextResponse.json(
      { error: "Survey not finished yet" },
      { status: 400 },
    );

  // Eligible for a payout: kept the reward, or bet and won.
  const eligible = session.bet === false || session.betWon === true;

  const bankName = parsed.data.bankName?.trim() || null;
  const bankAccountNumber = parsed.data.bankAccountNumber?.trim() || null;
  const bankAccountHolder = parsed.data.bankAccountHolder?.trim() || null;

  if (eligible && (!bankName || !bankAccountNumber || !bankAccountHolder)) {
    return NextResponse.json(
      { error: "Bank details are required" },
      { status: 400 },
    );
  }

  await db
    .update(schema.sessions)
    .set({
      bankName: eligible ? bankName : null,
      bankAccountNumber: eligible ? bankAccountNumber : null,
      bankAccountHolder: eligible ? bankAccountHolder : null,
      completedAt: new Date(),
    })
    .where(eq(schema.sessions.id, sessionId));

  return NextResponse.json({ ok: true });
}
