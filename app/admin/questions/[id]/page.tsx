import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuestionForm from "../question-form";

export const dynamic = "force-dynamic";

export default async function EditQuestionPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const [q] = await db
    .select()
    .from(schema.questions)
    .where(eq(schema.questions.id, id))
    .limit(1);
  if (!q) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
        <p className="text-sm text-muted-foreground">
          Phase {q.phase} · {q.group} · #{q.order}
        </p>
      </div>
      <QuestionForm
        mode="edit"
        id={q.id}
        defaults={{
          phase: q.phase,
          group: q.group as "Control" | "Treatment" | "Shared",
          order: q.order,
          text: q.text,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          rightAnswer: q.rightAnswer as "A" | "B" | "C",
          recommendation: q.recommendation as "A" | "B" | "C",
          explanation: q.explanation ?? "",
        }}
      />
    </div>
  );
}
