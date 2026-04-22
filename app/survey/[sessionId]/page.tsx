import SurveyRunner from "./survey-runner";

export default function SurveyRunnerPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SurveyRunner sessionId={Number(params.sessionId)} />;
}
