"use client";
import { readStreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";
import { Response as AiResponse } from "@/components/ai-elements/response";
import { cn } from "@/lib/utils";
import type { Consultation, Judge, Judgment } from "@/types";
import { createOrUpdateJudgment } from "./_actions/createOrUpdateJudgment";
import { queryAiModel } from "./_actions/queryAiModel";
import { AiMember } from "./ai-member";

const AVAILABLE_COLORS = [
  "violet",
  "emerald",
  "blue",
  "pink",
  "amber",
  "lime",
] as const;

export function ConsultationsPageClient({
  consultation,
  judgments,
  judges,
}: {
  consultation: Consultation;
  judgments: Judgment[];
  judges: Judge[];
}) {
  const [focusOn, setFocusOn] = useState<string | null>(null);
  const initialAiStates = judges.reduce<Record<string, Judgment>>(
    (acc, judge) => {
      acc[judge.modelId] = judgments.find(
        (judgement) => judge.modelId === judgement.judgeModelId,
      ) || {
        status: "initial",
        answer: null,
        fullAnswer: null,
        fullAnswerPreview: null,
        answerColor: null,
        completedAt: null,
        judgeModelId: judge.modelId,
      };
      return acc;
    },
    {},
  );
  const [aiStates, setAiStates] =
    useState<Record<string, Judgment>>(initialAiStates);

  useEffect(() => {
    let cancelled = false;

    judges.forEach(async (aiMember) => {
      const { stream } = await queryAiModel(
        aiMember.modelId,
        consultation.query,
      );

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
  }, [judges, consultation.query]);

  useEffect(() => {
    Object.entries(aiStates).forEach(([modelId, aiState]) => {
      const finishedStreaming = aiState.status === "done";
      const alreadyProcessed = aiState.answer;
      if (!finishedStreaming || alreadyProcessed) return;

      // Extract answer
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

      // Assign a color
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

      const newJudgement = {
        ...aiState,
        fullAnswer:
          aiState?.fullAnswer?.replace(answerRegex, "").trim() || null,
        answer,
        answerColor,
      };
      // Set the state
      setAiStates((prevState) => ({
        ...prevState,
        [modelId]: newJudgement,
      }));

      // Persist the data in db
      (async () => {
        await createOrUpdateJudgment(
          consultation.publicId,
          modelId,
          newJudgement,
        );
      })();
    });
  }, [aiStates, consultation.publicId]);

  return (
    <main className="flex h-full flex-col items-center py-18">
      <div className="flex w-4xl flex-1 flex-col">
        <h2 className="mb-4 text-lg">{consultation.query}</h2>
        <div
          className={cn("flex max-h-full flex-1 gap-2", {
            "flex-col": !focusOn,
          })}
        >
          <div
            className={cn("flex flex-wrap items-start gap-2", {
              "flex-col": !!focusOn,
            })}
          >
            {judges.map((props) => (
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
            <div className="flex grow rounded-sm border p-1">
              <div className="flex w-full overflow-y-auto rounded-xs border bg-neutral-900 px-8 py-8">
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
