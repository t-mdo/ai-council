"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createConsultation } from "@/app/(root)/_actions/createConsultation";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/ui/prompt-input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button>{pending ? <Loader className="animate-spin" /> : "↑"}</Button>;
}

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
      <SubmitButton />
    </form>
  );
}
