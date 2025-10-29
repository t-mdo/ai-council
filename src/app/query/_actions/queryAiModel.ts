"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";

const SYSTEM_PROMPT = `You are a helpful assistant. You are going to be asked a question about making a choice between multiple options. You will deliver a clear, helpful response. Format it in markdown.

Output a JSONL with your final answer as the very last line. DON'T output any formatting around this json line. No markdown or \`\`\`json block, only raw JSONL. The JSONL object has one key: answer, that has a string as value.

=== Example ===
User prompt: "If I wanted to build a twitter clone, should i use rails or js for the backend/api? I have more experience in rails but lean on the nextjs stack these days."

Your answer:
[Complete answer weighing both pros & cons]
{ "answer": "Rails" }`;

export async function queryAiModel(modelId: string, query: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = streamText({
      model: modelId,
      system: SYSTEM_PROMPT,
      prompt: query,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  return { stream: stream.value };
}
