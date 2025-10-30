import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function submit(formData: FormData) {
  "use server";

  const q = formData.get("query")?.valueOf();
  const params = new URLSearchParams({ q: typeof q === "string" ? q : "" });
  redirect(`/query?${params.toString()}`);
}

export default function Root() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col justify-center px-16 py-32">
        <form action={submit} className="flex w-full items-center gap-2">
          <Input
            name="query"
            placeholder="Ask the council of models to choose between multiple options"
          />
          <Button>↑</Button>
        </form>
      </main>
    </div>
  );
}
