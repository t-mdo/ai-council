"use client";
import { readStreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { queryAiModel } from "./_actions/queryAiModel";
import { AiMember } from "./ai-member";

export type AiState = {
  status: "initial" | "streaming" | "done" | "error";
  fullAnswer: string | null;
  answer: string | null;
  answerColor: string | null;
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

        setAiStates((prevState) => ({
          ...prevState,
          [aiMember.modelId]: {
            ...prevState[aiMember.modelId],
            status: "streaming",
            fullAnswer: (prevState[aiMember.modelId].fullAnswer || "") + delta,
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

      const answerRegex = /({ *"answer": ".*" *})$/i;

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

  if (focusOn) {
    return (
      <main className="flex flex-col gap-2 w-full py-16 px-4">
        <h2 className="text-lg mb-4">{query}</h2>
        <div className="flex gap-2 h-screen w-full">
          <div className="flex flex-col gap-2">
            {aiMembers.map((props) => (
              <AiMember
                key={props.modelId}
                onClick={() =>
                  setFocusOn((state) =>
                    state === props.modelId ? null : props.modelId,
                  )
                }
                aiState={aiStates[props.modelId]}
                focused={props.modelId === focusOn}
                {...props}
              />
            ))}
          </div>
          <div className="border rounded-sm w-full p-1 max-w-4xl">
            <div className="overflow-y-auto border rounded-xs w-full h-full py-8 px-8 bg-neutral-900">
              <div className="leading-relaxed text-md text-neutral-200 prose dark:prose-invert prose-neutral prose prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-headings:my-3 prose-strong:font-semibold">
                <Markdown>{aiStates[focusOn].fullAnswer}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center min-h-screen w-full flex-col py-32 px-16 bg-white dark:bg-black">
      <div className="flex flex-col">
        <h2 className="text-lg mb-4">{query}</h2>
        <div className="flex flex-wrap gap-2">
          {aiMembers.map((props) => (
            <AiMember
              key={props.modelId}
              onClick={() => {
                setFocusOn(props.modelId);
              }}
              aiState={aiStates[props.modelId]}
              {...props}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
