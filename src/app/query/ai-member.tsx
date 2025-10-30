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
  focused: boolean;
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
      className={cn("w-52 border rounded-sm p-1 text-left cursor-pointer", {
        "hover:shadow-[0_0_2px_rgba(255,255,255,0.4)]": !focused,
        "shadow-[0_0_5px_rgba(255,255,255,0.6)]": focused,
      })}
    >
      <div className="text-neutral-100 bg-neutral-900 mb-1 p-2 border rounded-xs flex items-center gap-2">
        <Image src={modelImagePath} alt="logo" width={32} height={32} />
        <h4 className="text-sm font-semibold">{modelName}</h4>
      </div>
      <div
        className={cn(
          "font-geist-mono p-2 border rounded-xs flex items-center gap-2",
          {
            [colorCss]: aiState.status === "done",
          },
        )}
      >
        {aiState.status === "initial" && (
          <p className="text-xs text-neutral-600 animate-pulse">Waiting...</p>
        )}
        {aiState.status === "streaming" && (
          <p className="text-xs text-neutral-600 animate-pulse">Thinking...</p>
        )}
        {aiState.status === "done" && (
          <p className="w-full text-center text-xs text-semibold">
            {aiState.answer}
          </p>
        )}
      </div>
    </button>
  );
}
