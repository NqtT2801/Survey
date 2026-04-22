import { z } from "zod";

export const answerChoice = z.enum(["A", "B", "C"]);
export const questionGroup = z.enum(["Control", "Treatment", "Shared"]);

export const questionInput = z.object({
  phase: z.number().int().refine((n) => n === 1 || n === 2, "Phase must be 1 or 2"),
  group: questionGroup,
  order: z.number().int().min(1).max(10),
  text: z.string().min(1).max(4000),
  optionA: z.string().min(1).max(1000),
  optionB: z.string().min(1).max(1000),
  optionC: z.string().min(1).max(1000),
  rightAnswer: answerChoice,
  recommendation: answerChoice,
  explanation: z.string().max(8000).default(""),
});

export type QuestionInput = z.infer<typeof questionInput>;
