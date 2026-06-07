"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WELCOME_INTRO } from "@/lib/constants";
import { renderIntroBody } from "@/components/intro-text";

export default function SurveyLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/survey/start", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not start survey");
      setLoading(false);
      return;
    }
    router.push(`/survey/${data.sessionId}`);
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardDescription className="whitespace-pre-wrap text-base text-foreground">
            {renderIntroBody(WELCOME_INTRO)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <Button
            size="lg"
            className="w-full"
            onClick={start}
            disabled={loading}
          >
            {loading ? "Đang bắt đầu…" : "Bắt đầu"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
