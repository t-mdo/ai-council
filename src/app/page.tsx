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
      <main className="flex justify-center min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <form action={submit} className="w-full flex gap-2">
          <Input name="query" />
          <Button>↑</Button>
        </form>
      </main>
    </div>
  );
}
