import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const judges = pgTable("judges", {
  id: serial("id").primaryKey(),
  modelId: text("model_id").notNull().unique(),
  modelName: text("model_name").notNull(),
  modelImagePath: text("model_image_path").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const judgments = pgTable(
  "judgments",
  {
    id: serial("id").primaryKey(),
    consultationId: integer("consultation_id")
      .notNull()
      .references(() => consultations.id),
    judgeId: integer("judge_id")
      .notNull()
      .references(() => judges.id),
    status: text("status", { enum: ["initial", "streaming", "done", "error"] })
      .notNull()
      .default("initial"),
    fullAnswer: text("full_answer"),
    answer: text("answer"),
    answerColor: text("answer_color"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("unique_consultation_judge").on(table.consultationId, table.judgeId),
  ],
);

export const consultationsRelations = relations(consultations, ({ many }) => ({
  judgments: many(judgments),
}));

export const judgesRelations = relations(judges, ({ many }) => ({
  judgments: many(judgments),
}));

export const judgmentsRelations = relations(judgments, ({ one }) => ({
  consultation: one(consultations, {
    fields: [judgments.consultationId],
    references: [consultations.id],
  }),
  judge: one(judges, {
    fields: [judgments.judgeId],
    references: [judges.id],
  }),
}));

export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;

export type Judge = typeof judges.$inferSelect;
export type NewJudge = typeof judges.$inferInsert;

export type Judgment = typeof judgments.$inferSelect;
export type NewJudgment = typeof judgments.$inferInsert;
