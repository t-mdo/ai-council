"use server";

import { db } from "@/db/index";
import { consultations } from "@/db/schema";

export async function submitQuery(formData: FormData) {
  const query = formData.get("query");

  if (typeof query !== "string" || !query.trim()) {
    return {
      success: false as const,
      error: "Please enter a question",
    };
  }

  try {
    const [consultation] = await db
      .insert(consultations)
      .values({
        query: query.trim(),
      })
      .returning();

    return {
      success: true as const,
      publicId: consultation.publicId,
    };
  } catch (error) {
    console.error("Failed to create consultation:", error);
    return {
      success: false as const,
      error: "Failed to create consultation. Please try again.",
    };
  }
}
