"use server";

import { db } from "@/db";

export async function getJudges() {
  return await db.query.judges.findMany();
}
