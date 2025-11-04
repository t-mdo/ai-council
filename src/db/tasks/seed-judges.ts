import { config } from "dotenv";
import { db } from "@/db";
import * as schema from "@/db/schema";

config({ path: ".env.local" });

const judges = [
  {
    modelId: "anthropic/claude-sonnet-4.5",
    modelName: "Claude Sonnet 4.5",
    modelImagePath: "/images/anthropic.avif",
  },
  {
    modelId: "openai/gpt-5",
    modelName: "GPT 5",
    modelImagePath: "/images/openai.avif",
  },
  {
    modelId: "google/gemini-2.5-pro",
    modelName: "Gemini Pro 2.5",
    modelImagePath: "/images/google.avif",
  },
  {
    modelId: "xai/grok-4",
    modelName: "Grok 4",
    modelImagePath: "/images/xai.avif",
  },
];

async function seedJudges() {
  console.log("🌱 Seeding judges...");

  try {
    for (const judge of judges) {
      await db
        .insert(schema.judges)
        .values(judge)
        .onConflictDoNothing({ target: schema.judges.modelId });

      console.log(`✅ Seeded judge: ${judge.modelName}`);
    }

    console.log("🎉 All judges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding judges:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedJudges();
