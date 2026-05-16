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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BET_INTRO,
  BET_OPTION_GAMBLE,
  BET_OPTION_TAKE,
  KNOWLEDGE_RATING_LABELS,
  KNOWLEDGE_RATING_QUESTION,
  PHASE1_CONTROL_INTRO,
  PHASE1_TREATMENT_INTRO,
  PHASE2_INTRO,
  RESULT_LOSE,
  RESULT_TAKE,
  RESULT_WIN,
} from "@/lib/constants";

const QUESTION_SECONDS = 20;

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
      const res = await fetch(`/api/survey/${sessionId}/questions`, {
        cache: "no-store",
      });
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
      group={state.group}
      questions={state.questions}
      startIndex={state.startIndex}
    />
  );
}

function ReadyRunner({
  sessionId,
  group,
  questions,
  startIndex,
}: {
  sessionId: number;
  group: "Control" | "Treatment";
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
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const startedAt = useRef<number>(performance.now());
  const submittedRef = useRef(false);
  const aliveRef = useRef(true);
  const choiceRef = useRef<"A" | "B" | "C" | null>(null);
  const everOpenedRef = useRef(false);

  // Phase intro covers — shown once before each phase's questions.
  const [phase1IntroDone, setPhase1IntroDone] = useState(false);
  const [phase2IntroDone, setPhase2IntroDone] = useState(false);

  // End-of-survey flow state
  const [endStep, setEndStep] = useState<"bet" | "rating" | "result">("bet");
  const [betChoice, setBetChoice] = useState<"take" | "gamble" | null>(null);
  const [knowledgeRating, setKnowledgeRating] = useState<number | null>(null);
  const [finishResult, setFinishResult] = useState<{
    bet: boolean;
    betWon: boolean | null;
  } | null>(null);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");

  const q = questions[index];
  const totalQs = questions.length;
  const isDone = index >= totalQs;

  const showPhase1Intro = !isDone && q?.phase === 1 && !phase1IntroDone;
  const showPhase2Intro = !isDone && q?.phase === 2 && !phase2IntroDone;
  const showCover = showPhase1Intro || showPhase2Intro;

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Per-question reset + 20s deadline. Keyed on q?.id so it is correct on
  // resume and skipped questions, and skipped entirely once we reach the
  // final form (q is undefined when index === totalQs) or while a phase
  // intro cover is showing (so the timer starts when the question appears).
  useEffect(() => {
    if (!q || showCover) return;
    setChoice(null);
    setOpened(false);
    setEverOpened(false);
    setError(null);
    setSecondsLeft(QUESTION_SECONDS);
    choiceRef.current = null;
    everOpenedRef.current = false;
    submittedRef.current = false;
    startedAt.current = performance.now();

    const deadline = setTimeout(() => {
      void submitAnswer({ timedOut: true });
    }, QUESTION_SECONDS * 1000);
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      clearTimeout(deadline);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id, showCover]);

  async function submitAnswer({
    timedOut = false,
  }: { timedOut?: boolean } = {}) {
    if (submittedRef.current || !q) return;
    const currentChoice = choiceRef.current;
    if (!timedOut && !currentChoice) return;
    submittedRef.current = true;
    if (aliveRef.current) {
      setSaving(true);
      setError(null);
    }
    const elapsed = timedOut
      ? QUESTION_SECONDS * 1000
      : Math.round(performance.now() - startedAt.current);
    const res = await fetch(`/api/survey/${sessionId}/answer`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: q.id,
        participantAnswer: currentChoice,
        openedBox: q.phase === 1 ? true : everOpenedRef.current,
        timeToAnswerMs: elapsed,
      }),
    });
    if (!res.ok) {
      submittedRef.current = false;
      const message = (await res.json().catch(() => ({}))).error ?? "Could not save answer";
      if (aliveRef.current) {
        setError(message);
        setSaving(false);
      }
      return;
    }
    if (aliveRef.current) {
      setSaving(false);
      setIndex((i) => i + 1);
    }
  }

  async function submitFinish() {
    if (betChoice === null || knowledgeRating === null) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/survey/${sessionId}/finish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bet: betChoice === "gamble",
        knowledgeRating,
      }),
    });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Không thể gửi");
      setSaving(false);
      return;
    }
    const data = (await res.json()) as { bet: boolean; betWon: boolean | null };
    setFinishResult({ bet: data.bet, betWon: data.betWon });
    setSaving(false);
    setEndStep("result");
  }

  async function submitComplete() {
    const eligible =
      !!finishResult &&
      (finishResult.bet === false || finishResult.betWon === true);
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/survey/${sessionId}/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        eligible
          ? {
              bankName: bankName.trim(),
              bankAccountNumber: bankAccountNumber.trim(),
              bankAccountHolder: bankAccountHolder.trim(),
            }
          : { bankName: null, bankAccountNumber: null, bankAccountHolder: null },
      ),
    });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Không thể gửi");
      setSaving(false);
      return;
    }
    router.push(`/survey/${sessionId}/thanks`);
  }

  // Phase intro covers — full-screen interstitials before the questions.
  if (showPhase1Intro) {
    return (
      <IntroCover
        title="Phần 1"
        body={group === "Control" ? PHASE1_CONTROL_INTRO : PHASE1_TREATMENT_INTRO}
        buttonLabel="Bắt đầu Phần 1"
        onContinue={() => setPhase1IntroDone(true)}
      />
    );
  }
  if (showPhase2Intro) {
    return (
      <IntroCover
        title="Phần 2"
        body={PHASE2_INTRO}
        buttonLabel="Bắt đầu Phần 2"
        onContinue={() => setPhase2IntroDone(true)}
      />
    );
  }

  // Result-step branching (only meaningful once finishResult is set).
  const betKept = finishResult?.bet === false;
  const betWon = finishResult?.betWon === true;
  const payoutEligible = betKept || betWon;
  const resultMessage = betKept ? RESULT_TAKE : betWon ? RESULT_WIN : RESULT_LOSE;
  const resultTitle = betKept
    ? "Hoàn tất"
    : betWon
      ? "Chúc mừng!"
      : "Kết quả đặt cược";

  return (
    <main className="container mx-auto flex min-h-screen max-w-2xl flex-col gap-6 py-10">
      <ProgressHeader index={isDone ? totalQs : index} total={totalQs} />

      {!isDone && q ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle>
                Phase {q.phase} · Question {q.order} of 10
              </CardTitle>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums ${
                  secondsLeft <= 5
                    ? "border-destructive text-destructive"
                    : "text-muted-foreground"
                }`}
                aria-live="polite"
              >
                Time left: {secondsLeft}s
              </span>
            </div>
            <CardDescription className="whitespace-pre-wrap text-base text-foreground">
              {q.text}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={choice ?? ""}
              onValueChange={(v) => {
                const picked = v as "A" | "B" | "C";
                setChoice(picked);
                choiceRef.current = picked;
              }}
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
              {q.phase === 1 ? (
                <div className="whitespace-pre-wrap rounded border bg-background p-3 text-sm">
                  {q.explanation || (
                    <span className="text-muted-foreground">
                      (No explanation provided.)
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const next = !opened;
                      setOpened(next);
                      if (next) {
                        setEverOpened(true);
                        everOpenedRef.current = true;
                      }
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
                </>
              )}
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={!choice || saving}
                onClick={() => void submitAnswer()}
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
      ) : endStep === "bet" ? (
        <Card>
          <CardHeader>
            <CardTitle>Phần thưởng của bạn</CardTitle>
            <CardDescription className="whitespace-pre-wrap text-base text-foreground">
              {BET_INTRO}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Bạn muốn chọn phương án nào?</Label>
              <RadioGroup
                value={betChoice ?? ""}
                onValueChange={(v) => setBetChoice(v as "take" | "gamble")}
              >
                <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="take" id="bet-take" />
                  <span className="flex-1 text-sm">{BET_OPTION_TAKE}</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary">
                  <RadioGroupItem value="gamble" id="bet-gamble" />
                  <span className="flex-1 text-sm">{BET_OPTION_GAMBLE}</span>
                </label>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button
                disabled={betChoice === null}
                onClick={() => setEndStep("rating")}
              >
                Tiếp tục
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : endStep === "rating" ? (
        <Card>
          <CardHeader>
            <CardTitle>Một câu hỏi khảo sát</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base whitespace-pre-wrap">
                {KNOWLEDGE_RATING_QUESTION}
              </Label>
              <RadioGroup
                value={knowledgeRating ? String(knowledgeRating) : ""}
                onValueChange={(v) => setKnowledgeRating(Number(v))}
              >
                {KNOWLEDGE_RATING_LABELS.map((label, i) => {
                  const n = i + 1;
                  return (
                    <label
                      key={n}
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary"
                    >
                      <RadioGroupItem value={String(n)} id={`k-${n}`} />
                      <span className="flex-1 text-sm">
                        <span className="mr-2 font-semibold">Mức {n}</span>
                        {label}
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={knowledgeRating === null || saving}
                onClick={() => void submitFinish()}
              >
                {saving ? "Đang gửi…" : "Tiếp tục"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{resultTitle}</CardTitle>
            <CardDescription className="whitespace-pre-wrap text-base text-foreground">
              {resultMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {payoutEligible ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Tên ngân hàng</Label>
                  <Input
                    id="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Ví dụ: Vietcombank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-number">Số tài khoản ngân hàng</Label>
                  <Input
                    id="bank-number"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Số tài khoản"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-holder">Tên chủ tài khoản</Label>
                  <Input
                    id="bank-holder"
                    value={bankAccountHolder}
                    onChange={(e) => setBankAccountHolder(e.target.value)}
                    placeholder="Họ và tên chủ tài khoản"
                  />
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={
                  saving ||
                  (payoutEligible &&
                    (!bankName.trim() ||
                      !bankAccountNumber.trim() ||
                      !bankAccountHolder.trim()))
                }
                onClick={() => void submitComplete()}
              >
                {saving ? "Đang gửi…" : "Hoàn tất"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function IntroCover({
  title,
  body,
  buttonLabel,
  onContinue,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  onContinue: () => void;
}) {
  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="whitespace-pre-wrap text-base text-foreground">
            {body}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" onClick={onContinue}>
            {buttonLabel}
          </Button>
        </CardContent>
      </Card>
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
