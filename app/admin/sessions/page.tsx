import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

function fmt(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString();
}

export default async function AdminSessionsPage() {
  const rows = await db
    .select()
    .from(schema.sessions)
    .orderBy(desc(schema.sessions.id));

  const completed = rows.filter((r) => r.completedAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            {completed.length} completed · {rows.length - completed.length} in
            progress
          </p>
        </div>
        <Button asChild>
          <a href="/api/admin/export" download>
            Export Excel
          </a>
        </Button>
      </div>

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
                {rows.length === 0 ? (
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
