import ExcelJS from "exceljs";
import { db, schema } from "@/lib/db";
import { asc, inArray } from "drizzle-orm";
import {
  KNOWLEDGE_RATING_QUESTION,
  QUESTIONS_PER_PHASE,
} from "@/lib/constants";

/**
 * Build an .xlsx whose layout matches the provided template:
 *
 * Row 1: "Phase X - Question Y" spans 5 columns per question (merged),
 *        then "Bet or not?" + knowledge-rating question at the end.
 * Row 2: per-question sub-headers:
 *        Participant's answer | Recommendation | Right answer | Open box? | Time to answer (s)
 *        For final 2 columns: "Participant's choice?" x2.
 * Row 3+: one row per completed session.
 *
 * Left-most columns:
 *   A = Participant ID, B = Group
 */
export async function buildResultsWorkbook(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Survey";
  const ws = wb.addWorksheet("Sheet1");

  // Fetch completed sessions + their answers
  const sessions = await db
    .select()
    .from(schema.sessions)
    .orderBy(asc(schema.sessions.id));

  const completed = sessions.filter((s) => s.completedAt);

  // Preload all questions once (we need them for headers and for right-answer/recommendation lookup)
  const allQuestions = await db
    .select()
    .from(schema.questions)
    .orderBy(
      asc(schema.questions.phase),
      asc(schema.questions.group),
      asc(schema.questions.order),
    );

  // Preload all answers for completed sessions
  const answersBySession = new Map<
    number,
    Map<number, (typeof schema.answers.$inferSelect)>
  >();
  if (completed.length > 0) {
    const rows = await db
      .select()
      .from(schema.answers)
      .where(
        inArray(
          schema.answers.sessionId,
          completed.map((s) => s.id),
        ),
      );
    for (const a of rows) {
      if (!answersBySession.has(a.sessionId)) {
        answersBySession.set(a.sessionId, new Map());
      }
      answersBySession.get(a.sessionId)!.set(a.questionId, a);
    }
  }

  // --- Header rows ---
  // Columns: A=Participant ID, B=Group, then 5 * 20 = 100 columns for questions, then 2 final columns.
  // Total columns = 2 + 100 + 2 = 104. Matches template (A..CZ).
  const phases = [1, 2] as const;
  const subHeaders = [
    "Participant's answer",
    "Recommendation",
    "Right answer",
    "Open box?",
    "Time to answer (s)",
  ];

  // Row 1 / Row 2
  const row1 = ws.getRow(1);
  const row2 = ws.getRow(2);
  row1.getCell(1).value = null;
  row1.getCell(2).value = null;
  row2.getCell(1).value = "Participant ID";
  row2.getCell(2).value = "Group";

  let col = 3; // 1-based column index; A=1, B=2, so C=3
  for (const phase of phases) {
    for (let q = 1; q <= QUESTIONS_PER_PHASE; q++) {
      const startCol = col;
      const endCol = col + subHeaders.length - 1;
      row1.getCell(startCol).value = `Phase ${phase} - Question ${q}`;
      ws.mergeCells(1, startCol, 1, endCol);
      for (let i = 0; i < subHeaders.length; i++) {
        row2.getCell(startCol + i).value = subHeaders[i];
      }
      col = endCol + 1;
    }
  }
  // Final 2 columns: CY = Bet or not?, CZ = knowledge rating
  const betCol = col;
  const kRatingCol = col + 1;
  row1.getCell(betCol).value = "Bet or not?";
  row1.getCell(kRatingCol).value = KNOWLEDGE_RATING_QUESTION;
  row2.getCell(betCol).value = "Participant's choice?";
  row2.getCell(kRatingCol).value = "Participant's choice?";

  // Style headers
  [row1, row2].forEach((r) => {
    r.eachCell({ includeEmpty: false }, (cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    });
  });
  row1.height = 30;
  row2.height = 40;

  // --- Data rows ---
  let dataRowIdx = 3;
  for (const s of completed) {
    const row = ws.getRow(dataRowIdx++);
    row.getCell(1).value = s.id;
    row.getCell(2).value = s.group;

    const sessionAnswers = answersBySession.get(s.id) ?? new Map();

    // For each phase/question slot, find the relevant question and answer.
    let c = 3;
    for (const phase of phases) {
      for (let order = 1; order <= QUESTIONS_PER_PHASE; order++) {
        // Find the question this session saw for this (phase, order).
        // Phase 1: group-specific. Phase 2: Shared.
        const wantGroup =
          phase === 1 ? (s.group as "Control" | "Treatment") : "Shared";
        const q = allQuestions.find(
          (x) => x.phase === phase && x.group === wantGroup && x.order === order,
        );
        const a = q ? sessionAnswers.get(q.id) : undefined;

        row.getCell(c + 0).value = a?.participantAnswer ?? null;
        row.getCell(c + 1).value = q?.recommendation ?? null;
        row.getCell(c + 2).value = q?.rightAnswer ?? null;
        row.getCell(c + 3).value = a ? Boolean(a.openedBox) : null;
        row.getCell(c + 4).value =
          a && a.timeToAnswerMs != null
            ? Math.round(a.timeToAnswerMs / 1000)
            : null;
        c += 5;
      }
    }

    row.getCell(betCol).value =
      s.bet === null || s.bet === undefined ? null : s.bet ? "Yes" : "No";
    row.getCell(kRatingCol).value = s.knowledgeRating ?? null;
  }

  // Reasonable column widths
  ws.getColumn(1).width = 14;
  ws.getColumn(2).width = 12;
  for (let i = 3; i <= kRatingCol; i++) {
    ws.getColumn(i).width = 18;
  }

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
