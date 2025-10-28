import { AiMember } from "./ai-member";

export default async function Root({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  if (!q || Array.isArray(q)) return;

  const query = decodeURIComponent(q);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex items-center min-h-screen w-full flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col">
          <h2 className="text-lg mb-12">{query}</h2>
          <div className="flex flex-wrap gap-2 ml-2">
            <AiMember
              modelId="claude-sonnet-4.5"
              modelName="Claude Sonnet 4.5"
              modelImagePath="/images/anthropic.avif"
            />
            <AiMember
              modelId="gpt-5"
              modelName="GPT 5"
              modelImagePath="/images/openai.avif"
            />
            <AiMember
              modelId="gemini-pro-2.5"
              modelName="Gemini Pro 2.5"
              modelImagePath="/images/google.avif"
            />
            <AiMember
              modelId="grok-5"
              modelName="Grok 4"
              modelImagePath="/images/xai.avif"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
