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
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Before you begin</CardTitle>
          <CardDescription>
            You will answer 20 multiple-choice questions in two phases of 10.
            For each question you will see a recommendation and can optionally
            open an explanation box. Please answer every question in one
            sitting. Your answer time is recorded.
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
            {loading ? "Starting…" : "Start"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
