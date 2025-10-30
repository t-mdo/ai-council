"use client";
import { readStreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";
import { Response as AiResponse } from "@/components/ai-elements/response";
import { cn } from "@/lib/utils";
import { queryAiModel } from "./_actions/queryAiModel";
import { AiMember } from "./ai-member";

export type AiState = {
  status: "initial" | "streaming" | "done" | "error";
  fullAnswer: string | null;
  answer: string | null;
  answerColor: string | null;
  fullAnswerPreview: string | null;
};

const AVAILABLE_COLORS = [
  "violet",
  "emerald",
  "blue",
  "pink",
  "amber",
  "lime",
] as const;

const aiMembers = [
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

export function QueryPageClient({ query }: { query: string }) {
  const [focusOn, setFocusOn] = useState<string | null>(null);
  const initialAiStates = aiMembers.reduce<Record<string, AiState>>(
    (acc, aiMember) => {
      acc[aiMember.modelId] = {
        status: "initial",
        answer: null,
        fullAnswer: null,
        fullAnswerPreview: null,
        answerColor: null,
      };
      return acc;
    },
    {},
  );
  const [aiStates, setAiStates] =
    useState<Record<string, AiState>>(initialAiStates);

  useEffect(() => {
    let cancelled = false;

    aiMembers.forEach(async (aiMember) => {
      const { stream } = await queryAiModel(aiMember.modelId, query);

      for await (const delta of readStreamableValue(stream)) {
        if (cancelled) break;

        const PREVIEW_CHAR_LENGTH = 30;
        setAiStates((prevState) => ({
          ...prevState,
          [aiMember.modelId]: {
            ...prevState[aiMember.modelId],
            status: "streaming",
            fullAnswer: (prevState[aiMember.modelId].fullAnswer || "") + delta,
            fullAnswerPreview: (
              (prevState[aiMember.modelId].fullAnswerPreview || "") + delta
            ).slice(-PREVIEW_CHAR_LENGTH),
          },
        }));
      }

      if (!cancelled) {
        setAiStates((prevState) => ({
          ...prevState,
          [aiMember.modelId]: {
            ...prevState[aiMember.modelId],
            status: "done",
          },
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    Object.entries(aiStates).forEach(([modelId, aiState]) => {
      if (aiState.status !== "done" || aiState.answer) return;

      const answerRegex = /({ *"answer" *: *".*" *})$/i;

      const match = aiState.fullAnswer?.match(answerRegex);
      if (!match) {
        setAiStates((prevState) => ({
          ...prevState,
          [modelId]: {
            ...prevState[modelId],
            status: "error",
          },
        }));
        return;
      }

      const answer = JSON.parse(match[0])?.answer;
      if (!answer) {
        setAiStates((prevState) => ({
          ...prevState,
          [modelId]: {
            ...prevState[modelId],
            status: "error",
          },
        }));
        return;
      }

      let answerColor: string;

      const sameAnswerAlreadyAssignedColor = Object.values(aiStates).find(
        (aiState) =>
          aiState.answer?.toLowerCase() === answer.toLowerCase() &&
          aiState.answerColor,
      )?.answerColor;

      if (sameAnswerAlreadyAssignedColor) {
        answerColor = sameAnswerAlreadyAssignedColor;
      } else {
        const nbOfColorUsed = new Set(
          Object.values(aiStates)
            .map((aiState) => aiState.answerColor)
            .filter(Boolean),
        ).size;
        answerColor = AVAILABLE_COLORS[nbOfColorUsed];
      }
      setAiStates((prevState) => ({
        ...prevState,
        [modelId]: {
          ...prevState[modelId],
          fullAnswer:
            prevState[modelId]?.fullAnswer?.replace(answerRegex, "").trim() ||
            null,
          answer,
          answerColor,
        },
      }));
    });
  }, [aiStates]);

  return (
    <main className="flex h-full flex-col items-center py-18">
      <div className="flex h-full w-4xl flex-col">
        <h2 className="mb-4 text-lg">{query}</h2>
        <div className={cn("flex h-full gap-2", { "flex-col": !focusOn })}>
          <div
            className={cn("flex flex-wrap gap-2", {
              "flex-col": !!focusOn,
            })}
          >
            {aiMembers.map((props) => (
              <AiMember
                key={props.modelId}
                onClick={() => {
                  setFocusOn((prevState) =>
                    prevState === props.modelId ? null : props.modelId,
                  );
                }}
                aiState={aiStates[props.modelId]}
                focused={focusOn === props.modelId}
                {...props}
              />
            ))}
          </div>
          {focusOn && (
            <div className="flex h-full grow rounded-sm border p-1">
              <div className="flex h-full w-full overflow-y-auto rounded-xs border bg-neutral-900 px-8 py-8">
                <div className="prose dark:prose-invert prose-neutral prose prose-headings:my-3 prose-li:my-0.5 prose-p:my-2 prose-ul:my-2 prose-strong:font-semibold text-md text-neutral-200 leading-relaxed">
                  <div className="pb-8">
                    <AiResponse>{aiStates[focusOn].fullAnswer}</AiResponse>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
