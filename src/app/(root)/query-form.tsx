"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createConsultation } from "@/app/(root)/_actions/createConsultation";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/ui/prompt-input";

export function QueryForm() {
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        const result = await createConsultation(formData);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        router.push(`/consultations/${result.publicId}`);
      }}
      className="flex w-full items-end items-center gap-2"
    >
      <PromptInput
        name="query"
        placeholder="Ask the council of models to choose between multiple options"
      />
      <Button>↑</Button>
    </form>
  );
}
