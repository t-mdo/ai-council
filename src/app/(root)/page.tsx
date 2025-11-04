import { QueryForm } from "./query-form";

export default function Root() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col justify-center px-16 py-32">
        <QueryForm />
      </main>
    </div>
  );
}
