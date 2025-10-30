"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AiState } from "./page-client";

type AiMemberObject = {
  modelImagePath: string;
  modelName: string;
  modelId: string;
};

export function AiMember({
  modelImagePath,
  modelName,
  aiState,
  focused,
  onClick,
}: AiMemberObject & {
  aiState: AiState;
  focused?: boolean;
  onClick: () => void;
}) {
  const colorCss = `bg-${aiState.answerColor}-900 text-${aiState.answerColor}-100`;

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-52 cursor-pointer rounded-sm border p-1 text-left outline-none",
        {
          "hover:shadow-[0_0_2px_rgba(255,255,255,0.4)]": !focused,
          "shadow-[0_0_2px_rgba(255,255,255,0.8)]": focused,
        },
      )}
    >
      <div className="mb-1 flex items-center gap-2 rounded-xs border bg-neutral-900 p-2 text-neutral-100">
        <Image src={modelImagePath} alt="logo" width={32} height={32} />
        <h4 className="font-semibold text-sm">{modelName}</h4>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xs border p-2 font-geist-mono",
          {
            [colorCss]: aiState.status === "done",
          },
        )}
      >
        {aiState.status === "initial" && (
          <p className="animate-pulse text-neutral-600 text-xs">Waiting...</p>
        )}
        {aiState.status === "streaming" && (
          <p className="w-full animate-pulse overflow-hidden text-ellipsis text-nowrap text-neutral-600 text-xs">
            {aiState.fullAnswerPreview}…
          </p>
        )}
        {aiState.status === "done" && (
          <p className="w-full text-center text-semibold text-xs">
            {aiState.answer}
          </p>
        )}
      </div>
    </button>
  );
}
