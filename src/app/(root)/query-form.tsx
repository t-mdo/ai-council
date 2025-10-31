"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitQuery } from "@/app/(root)/_actions/submitQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QueryForm() {
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        const result = await submitQuery(formData);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        const params = new URLSearchParams({
          q: result.query,
        });
        router.push(`/query?${params.toString()}`);
      }}
      className="flex w-full items-center gap-2"
    >
      <Input
        name="query"
        placeholder="Ask the council of models to choose between multiple options"
      />
      <Button>↑</Button>
    </form>
  );
}
