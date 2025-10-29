"use client";
import { useState } from "react";
import { AiMember } from "./ai-member";

const aiMembersProps = [
  {
    modelId: "claude-sonnet-4.5",
    modelName: "Claude Sonnet 4.5",
    modelImagePath: "/images/anthropic.avif",
  },
  {
    modelId: "gpt-5",
    modelName: "GPT 5",
    modelImagePath: "/images/openai.avif",
  },
  {
    modelId: "gemini-pro-2.5",
    modelName: "Gemini Pro 2.5",
    modelImagePath: "/images/google.avif",
  },
  {
    modelId: "grok-5",
    modelName: "Grok 4",
    modelImagePath: "/images/xai.avif",
  },
];

export function QueryPageClient({ query }: { query: string }) {
  const [focusOn, setFocusOn] = useState<string | null>(null);

  if (focusOn) {
    return (
      <main className="flex gap-2 min-h-screen w-full py-16 px-4">
        <div className="flex flex-col gap-2 ml-2">
          {aiMembersProps.map((props) => (
            <AiMember
              key={props.modelId}
              onClick={() =>
                setFocusOn((state) =>
                  state === props.modelId ? null : props.modelId,
                )
              }
              {...props}
            />
          ))}
        </div>
        <div className="border rounded-sm w-full p-1">
          <div className="border rounded-xs w-full h-full py-8 bg-neutral-900">
            <p className="mx-auto prose-invert text-sm max-w-xl text-neutral-200"></p>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="flex items-center min-h-screen w-full flex-col py-32 px-16 bg-white dark:bg-black">
      <div className="flex flex-col">
        <h2 className="text-lg mb-12">{query}</h2>
        <div className="flex flex-wrap gap-2 ml-2">
          {aiMembersProps.map((aiMemberProps) => (
            <AiMember
              key={aiMemberProps.modelId}
              onClick={() => {
                setFocusOn(aiMemberProps.modelId);
              }}
              {...aiMemberProps}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
