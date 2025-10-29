"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AiMemberObject = {
  modelImagePath: string;
  modelName: string;
  modelId: string;
};

export function AiMember({
  modelImagePath,
  modelName,
  modelId,
  onClick,
}: AiMemberObject & { onClick: () => void }) {
  const rand = Math.random();
  const state = rand < 0.5 ? "decided" : "thinking";

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
      className="w-52 border rounded-sm p-1 text-left cursor-pointer"
    >
      <div className="text-neutral-100 bg-neutral-900 mb-1 p-2 border rounded-xs flex items-center gap-2">
        <Image src={modelImagePath} alt="logo" width={32} height={32} />
        <h4 className="text-sm font-semibold">{modelName}</h4>
      </div>
      <div
        className={cn(
          "font-geist-mono p-2 border rounded-xs flex items-center gap-2",
          {
            "bg-purple-900 text-purple-100": state === "decided" && rand < 0.25,
            "bg-cyan-900 text-cyan-100": state === "decided" && rand > 0.25,
          },
        )}
      >
        {state === "thinking" && (
          <p className="text-xs text-neutral-600 animate-pulse">Thinking...</p>
        )}
        {state === "decided" && (
          <p className="w-full text-center text-xs text-semibold">
            {rand < 0.25 ? "Rails" : "Javascript"}
          </p>
        )}
      </div>
    </button>
  );
}
