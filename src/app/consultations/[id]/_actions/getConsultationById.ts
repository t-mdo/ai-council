"use server";

import { NeonDbError } from "@neondatabase/serverless";
import { DrizzleQueryError, eq } from "drizzle-orm";
import pick from "lodash/pick";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import type { Consultation, Judgment } from "@/types";

const ERROR_CODE_INVALID_INPUT_SYNTAX_FOR_TYPE_UUID = "22P02" as const;

export async function getConsultationById(
  id: string,
): Promise<(Consultation & { judgments: Judgment[] }) | null> {
  try {
    const result = await db.query.consultations.findFirst({
      where: eq(schema.consultations.publicId, id),
      with: {
        judgments: {
          with: {
            judge: true,
          },
        },
      },
    });
    if (!result) return null;
    return {
      ...pick(result, ["publicId", "query", "createdAt"]),
      judgments: result.judgments.map((judgment) => ({
        ...pick(judgment, [
          "status",
          "fullAnswer",
          "answer",
          "answerColor",
          "completedAt",
        ]),
        judgeModelId: judgment.judge.modelId,
      })),
    };
  } catch (error) {
    if (
      error instanceof DrizzleQueryError &&
      error.cause instanceof NeonDbError
    ) {
      if (error.cause.code === ERROR_CODE_INVALID_INPUT_SYNTAX_FOR_TYPE_UUID)
        return null;
    }
    throw error;
  }
}
