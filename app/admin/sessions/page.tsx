"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SessionRow = {
  id: number;
  group: "Control" | "Treatment";
  startedAt: string | null;
  completedAt: string | null;
  bet: boolean | null;
  knowledgeRating: number | null;
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString();
}

export default function AdminSessionsPage() {
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/sessions?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Load failed (${res.status})`);
      }
      const data = (await res.json()) as { sessions: SessionRow[] };
      if (!aliveRef.current) return;
      setRows(data.sessions);
    } catch (err) {
      if (!aliveRef.current) return;
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function exportExcel() {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/export?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-results-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (!aliveRef.current) return;
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      if (aliveRef.current) setExporting(false);
    }
  }

  const completedCount = rows?.filter((r) => r.completedAt).length ?? 0;
  const inProgressCount = (rows?.length ?? 0) - completedCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            {rows
              ? `${completedCount} completed · ${inProgressCount} in progress`
              : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => void refresh()}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Button onClick={() => void exportExcel()} disabled={exporting}>
            {exporting ? "Exporting…" : "Export Excel"}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Group</th>
                  <th className="p-3">Started</th>
                  <th className="p-3">Completed</th>
                  <th className="p-3">Bet</th>
                  <th className="p-3">Knowledge</th>
                </tr>
              </thead>
              <tbody>
                {rows === null ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-muted-foreground"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-muted-foreground"
                    >
                      No sessions yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="p-3 font-mono">{r.id}</td>
                      <td className="p-3">{r.group}</td>
                      <td className="p-3">{fmt(r.startedAt)}</td>
                      <td className="p-3">{fmt(r.completedAt)}</td>
                      <td className="p-3">
                        {r.bet === null || r.bet === undefined
                          ? "—"
                          : r.bet
                            ? "Yes"
                            : "No"}
                      </td>
                      <td className="p-3">{r.knowledgeRating ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
