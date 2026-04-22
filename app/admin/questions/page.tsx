import Link from "next/link";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUESTIONS_PER_PHASE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Bucket = {
  phase: 1 | 2;
  group: "Control" | "Treatment" | "Shared";
  label: string;
};

const BUCKETS: Bucket[] = [
  { phase: 1, group: "Control", label: "Phase 1 — Control" },
  { phase: 1, group: "Treatment", label: "Phase 1 — Treatment" },
  { phase: 2, group: "Shared", label: "Phase 2 — Shared (both groups)" },
];

export default async function AdminQuestionsPage() {
  const rows = await db
    .select()
    .from(schema.questions)
    .orderBy(
      asc(schema.questions.phase),
      asc(schema.questions.group),
      asc(schema.questions.order),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Questions</h1>
          <p className="text-sm text-muted-foreground">
            Each bucket needs exactly {QUESTIONS_PER_PHASE} questions before
            participants can run the survey.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/questions/new">Add question</Link>
        </Button>
      </div>

      {BUCKETS.map((b) => {
        const items = rows.filter(
          (r) => r.phase === b.phase && r.group === b.group,
        );
        return (
          <Card key={b.label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {b.label}{" "}
                <span
                  className={
                    items.length === QUESTIONS_PER_PHASE
                      ? "text-muted-foreground text-sm font-normal"
                      : "text-destructive text-sm font-normal"
                  }
                >
                  ({items.length} / {QUESTIONS_PER_PHASE})
                </span>
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/admin/questions/new?phase=${b.phase}&group=${b.group}`}
                >
                  Add to this bucket
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No questions yet.
                </p>
              ) : (
                <ol className="space-y-2">
                  {items.map((q) => (
                    <li
                      key={q.id}
                      className="flex items-center justify-between gap-4 rounded-md border bg-background p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">
                          #{q.order} · right: {q.rightAnswer} · rec:{" "}
                          {q.recommendation}
                        </div>
                        <div className="truncate text-sm">{q.text}</div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/questions/${q.id}`}>Edit</Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
