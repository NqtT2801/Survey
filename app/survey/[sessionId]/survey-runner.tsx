"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { KNOWLEDGE_RATING_QUESTION } from "@/lib/constants";

type Question = {
  id: number;
  phase: 1 | 2;
  order: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  recommendation: "A" | "B" | "C";
  explanation: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "ready";
      group: "Control" | "Treatment";
      questions: Question[];
      startIndex: number;
    };

export default function SurveyRunner({ sessionId }: { sessionId: number }) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`/api/survey/${sessionId}/questions`);
      const data = await res.json();
      if (!alive) return;
      if (!res.ok) {
        setState({ kind: "error", message: data.error ?? "Load failed" });
        return;
      }
      const answered = new Set<number>(data.answeredQuestionIds ?? []);
      const startIndex = (data.questions as Question[]).findIndex(
        (q) => !answered.has(q.id),
      );
      setState({
        kind: "ready",
        group: data.group,
        questions: data.questions,
        startIndex: startIndex === -1 ? data.questions.length : startIndex,
      });
    })();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  if (state.kind === "loading") {
    return (
      <main className="container flex min-h-screen items-center justify-center py-12">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }
  if (state.kind === "error") {
    return (
      <main className="container flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Can't start</CardTitle>
            <CardDescription>{state.message}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <ReadyRunner
      sessionId={sessionId}
      questions={state.questions}
      startIndex={state.startIndex}
    />
  );
}

function ReadyRunner({
  sessionId,
  questions,
  startIndex,
}: {
  sessionId: number;
  questions: Question[];
  startIndex: number;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(startIndex);
  const [choice, setChoice] = useState<"A" | "B" | "C" | null>(null);
  const [opened, setOpened] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(performance.now());

  // Final form state
  const [bet, setBet] = useState<"yes" | "no" | null>(null);
  const [knowledgeRating, setKnowledgeRating] = useState<number | null>(null);

  const q = questions[index];
  const totalQs = questions.length;
  const isDone = index >= totalQs;

  // Reset per-question state whenever question changes.
  useEffect(() => {
    setChoice(null);
    setOpened(false);
    setEverOpened(false);
    setError(null);
    startedAt.current = performance.now();
  }, [index]);

  async function submitAnswer() {
    if (!q || !choice) return;
    setSaving(true);
    setError(null);
    const elapsed = Math.round(performance.now() - startedAt.current);
    const res = await fetch(`/api/survey/${sessionId}/answer`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: q.id,
        participantAnswer: choice,
        openedBox: everOpened,
        timeToAnswerMs: elapsed,
      }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Could not save answer");
      setSaving(false);
      return;
    }
    setSaving(false);
    setIndex((i) => i + 1);
  }

  async function submitFinal() {
    if (bet === null || knowledgeRating === null) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/survey/${sessionId}/finish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bet: bet === "yes",
        knowledgeRating,
      }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Could not submit");
      setSaving(false);
      return;
    }
    router.push(`/survey/${sessionId}/thanks`);
  }

  return (
    <main className="container mx-auto flex min-h-screen max-w-2xl flex-col gap-6 py-10">
      <ProgressHeader index={isDone ? totalQs : index} total={totalQs} />

      {!isDone && q ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Phase {q.phase} · Question {q.order} of 10
            </CardTitle>
            <CardDescription className="whitespace-pre-wrap text-base text-foreground">
              {q.text}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={choice ?? ""}
              onValueChange={(v) => setChoice(v as "A" | "B" | "C")}
            >
              {(["A", "B", "C"] as const).map((letter) => {
                const val =
                  letter === "A"
                    ? q.optionA
                    : letter === "B"
                      ? q.optionB
                      : q.optionC;
                return (
                  <label
                    key={letter}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem value={letter} id={`opt-${letter}`} />
                    <span className="flex-1 text-sm">
                      <span className="mr-2 font-semibold">{letter}.</span>
                      {val}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>

            <div className="rounded-md border bg-muted/30 p-4 space-y-3">
              <div className="text-sm">
                <span className="font-semibold">Recommendation:</span>{" "}
                <span className="font-semibold">{q.recommendation}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = !opened;
                  setOpened(next);
                  if (next) setEverOpened(true);
                }}
              >
                {opened ? "Hide explanation" : "Open explanation"}
              </Button>
              {opened ? (
                <div className="whitespace-pre-wrap rounded border bg-background p-3 text-sm">
                  {q.explanation || (
                    <span className="text-muted-foreground">
                      (No explanation provided.)
                    </span>
                  )}
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={!choice || saving}
                onClick={submitAnswer}
              >
                {saving
                  ? "Saving…"
                  : index === totalQs - 1
                    ? "Finish questions"
                    : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Two final questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Bet or not?</Label>
              <p className="text-sm text-muted-foreground">
                Would you bet on your answers being correct?
              </p>
              <RadioGroup
                value={bet ?? ""}
                onValueChange={(v) => setBet(v as "yes" | "no")}
              >
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="yes" id="bet-yes" />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="no" id="bet-no" />
                  <span className="text-sm">No</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base whitespace-pre-wrap">
                {KNOWLEDGE_RATING_QUESTION}
              </Label>
              <RadioGroup
                value={knowledgeRating ? String(knowledgeRating) : ""}
                onValueChange={(v) => setKnowledgeRating(Number(v))}
                className="grid grid-cols-5 gap-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary"
                  >
                    <RadioGroupItem value={String(n)} id={`k-${n}`} />
                    <span className="text-sm font-semibold">{n}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={bet === null || knowledgeRating === null || saving}
                onClick={submitFinal}
              >
                {saving ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function ProgressHeader({ index, total }: { index: number; total: number }) {
  const pct = Math.round((index / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {Math.min(index + 1, total)} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
