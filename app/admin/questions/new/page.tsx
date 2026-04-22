import QuestionForm from "../question-form";

type SearchParams = {
  phase?: string;
  group?: string;
};

export default function NewQuestionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const phase = searchParams.phase === "2" ? 2 : 1;
  const group =
    searchParams.group === "Treatment"
      ? "Treatment"
      : searchParams.group === "Shared"
        ? "Shared"
        : "Control";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Add question
        </h1>
        <p className="text-sm text-muted-foreground">
          Phase {phase} · {group}
        </p>
      </div>
      <QuestionForm
        mode="create"
        defaults={{
          phase,
          group: group as "Control" | "Treatment" | "Shared",
          order: 1,
          text: "",
          optionA: "",
          optionB: "",
          optionC: "",
          rightAnswer: "A",
          recommendation: "A",
          explanation: "",
        }}
      />
    </div>
  );
}
