import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThanksPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle>Thank you</CardTitle>
          <CardDescription>
            Your responses have been recorded. You may close this window.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Participant ID: {params.sessionId}
        </CardContent>
      </Card>
    </main>
  );
}
