import type * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";

export function PromptInput({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;

      e.preventDefault();
      const form = e?.currentTarget?.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <Textarea
      onKeyDown={handleKeydown}
      data-slot="input"
      className={cn("max-h-64 min-h-auto resize-none", className)}
      {...props}
    />
  );
}
