"use server";

import { NeonDbError } from "@neondatabase/serverless";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import type { Consultation } from "@/types";

const ERROR_CODE_INVALID_INPUT_SYNTAX_FOR_TYPE_UUID = "22P02" as const;

export async function getConsultationById(
  id: string,
): Promise<Consultation | null> {
  try {
    const results = await db
      .select({
        publicId: schema.consultations.publicId,
        query: schema.consultations.query,
        createdAt: schema.consultations.createdAt,
      })
      .from(schema.consultations)
      .where(eq(schema.consultations.publicId, id))
      .limit(1);
    return results[0] || null;
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
