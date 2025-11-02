import { and, eq } from "drizzle-orm";
import pick from "lodash/pick";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { Judgment } from "@/types";

export async function createOrUpdateJudgment(
  consultationPublicId: string,
  modelId: string,
  judgment: Judgment,
) {
  const consultationQuery = await db
    .select({
      id: schema.consultations.id,
    })
    .from(schema.consultations)
    .where(eq(schema.consultations.publicId, consultationPublicId))
    .limit(1);
  const consultationId = consultationQuery[0]?.id;
  if (!consultationId)
    throw new Error("Create Judgment: Consultation not found");

  const judgeQuery = await db
    .select({
      id: schema.judges.id,
    })
    .from(schema.judges)
    .where(eq(schema.judges.modelId, modelId))
    .limit(1);
  const judgeId = judgeQuery[0]?.id;
  if (!judgeId) throw new Error("Create Judgment: Judge not found");

  const judgmentQuery = await db
    .select({
      id: schema.judgments.id,
    })
    .from(schema.judgments)
    .where(
      and(
        eq(schema.judgments.consultationId, consultationId),
        eq(schema.judgments.judgeId, judgeId),
      ),
    )
    .limit(1);
  const judgmentId = judgmentQuery[0]?.id;

  const judgmentNewState = pick(judgment, [
    "status",
    "fullAnswer",
    "answer",
    "answerColor",
  ]);
  if (judgmentId) {
    db.update(schema.judgments)
      .set(judgmentNewState)
      .where(eq(schema.judgments.id, judgmentId));
  } else {
    db.insert(schema.judgments).values({
      consultationId: consultationId,
      judgeId: judgeId,
      ...judgmentNewState,
    });
  }
}
