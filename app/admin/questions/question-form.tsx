"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type QuestionFormValues = {
  phase: number;
  group: "Control" | "Treatment" | "Shared";
  order: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  rightAnswer: "A" | "B" | "C";
  recommendation: "A" | "B" | "C";
  explanation: string;
};

export default function QuestionForm({
  mode,
  id,
  defaults,
}: {
  mode: "create" | "edit";
  id?: number;
  defaults: QuestionFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<QuestionFormValues>(defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof QuestionFormValues>(
    key: K,
    value: QuestionFormValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url =
      mode === "create"
        ? "/api/admin/questions"
        : `/api/admin/questions/${id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Save failed");
      setSaving(false);
      return;
    }
    router.push("/admin/questions");
    router.refresh();
  }

  async function remove() {
    if (!id) return;
    if (!confirm("Delete this question?")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      setSaving(false);
      return;
    }
    router.push("/admin/questions");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Phase</Label>
          <Select
            value={String(values.phase)}
            onValueChange={(v) => update("phase", Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Phase 1</SelectItem>
              <SelectItem value="2">Phase 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Group</Label>
          <Select
            value={values.group}
            onValueChange={(v) =>
              update("group", v as "Control" | "Treatment" | "Shared")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Control">Control</SelectItem>
              <SelectItem value="Treatment">Treatment</SelectItem>
              <SelectItem value="Shared">Shared (Phase 2 only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Order (1–10)</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={values.order}
            onChange={(e) => update("order", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Question text</Label>
        <Textarea
          value={values.text}
          onChange={(e) => update("text", e.target.value)}
          rows={3}
          required
        />
      </div>

      {(["A", "B", "C"] as const).map((letter) => {
        const key = `option${letter}` as const;
        return (
          <div className="space-y-2" key={letter}>
            <Label>Option {letter}</Label>
            <Input
              value={values[key]}
              onChange={(e) => update(key, e.target.value)}
              required
            />
          </div>
        );
      })}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Right answer</Label>
          <Select
            value={values.rightAnswer}
            onValueChange={(v) =>
              update("rightAnswer", v as "A" | "B" | "C")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Recommendation shown to participant</Label>
          <Select
            value={values.recommendation}
            onValueChange={(v) =>
              update("recommendation", v as "A" | "B" | "C")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Explanation (shown only if participant opens the box)</Label>
        <Textarea
          value={values.explanation}
          onChange={(e) => update("explanation", e.target.value)}
          rows={5}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
        {mode === "edit" ? (
          <Button
            type="button"
            variant="destructive"
            onClick={remove}
            disabled={saving}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
