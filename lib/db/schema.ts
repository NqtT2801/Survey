import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const groupEnum = pgEnum("group", ["Control", "Treatment"]);
export const questionGroupEnum = pgEnum("question_group", [
  "Control",
  "Treatment",
  "Shared",
]);
export const answerEnum = pgEnum("answer_choice", ["A", "B", "C"]);

/**
 * Questions. Phase 1 has one row per (order, group in Control|Treatment).
 * Phase 2 is shared across groups (question_group = 'Shared').
 */
export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    phase: integer("phase").notNull(),
    group: questionGroupEnum("group").notNull(),
    order: integer("order").notNull(),
    text: text("text").notNull(),
    optionA: text("option_a").notNull(),
    optionB: text("option_b").notNull(),
    optionC: text("option_c").notNull(),
    rightAnswer: answerEnum("right_answer").notNull(),
    recommendation: answerEnum("recommendation").notNull(),
    explanation: text("explanation").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    phaseGroupOrderIdx: index("questions_phase_group_order_idx").on(
      t.phase,
      t.group,
      t.order,
    ),
  }),
);

/** One row per participant session. */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  group: groupEnum("group").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  bet: boolean("bet"),
  knowledgeRating: integer("knowledge_rating"),
});

/** One row per answered question within a session. */
export const answers = pgTable(
  "answers",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "restrict" }),
    participantAnswer: answerEnum("participant_answer").notNull(),
    openedBox: boolean("opened_box").notNull().default(false),
    timeToAnswerMs: integer("time_to_answer_ms").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    sessionIdx: index("answers_session_idx").on(t.sessionId),
  }),
);

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
