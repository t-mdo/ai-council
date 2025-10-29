"use server";

import { createStreamableValue } from "@ai-sdk/rsc";
import { streamText } from "ai";

const SYSTEM_PROMPT = `You are a helpful assistant. You are going to be asked a question about making a choice between multiple options. You will deliver a clear, helpful response. Format it in markdown. As the very last line output a json line with your final answer.

=== Example ===
User prompt: "If I wanted to build a twitter clone, should i use rails or js for the backend/api? I have more experience in rails but lean on the nextjs stack these days."

Your answer:
[Complete answer weighing both pros & cons]
{ answer: 'Rails' }`;

export async function queryAiModel(query: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = streamText({
      model: "google/gemini-2.5-flash",
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
