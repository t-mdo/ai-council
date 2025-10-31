import {
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").notNull().unique().defaultRandom(),
  query: text("query").notNull(),
  responses: jsonb("responses").notNull().$type<
    Array<{
      status: "initial" | "streaming" | "done" | "error";
      fullAnswer: string | null;
      answer: string | null;
      answerColor: string | null;
      modelId: string;
      modelName: string;
      modelImagePath: string;
      completedAt: string | null;
    }>
  >(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;
