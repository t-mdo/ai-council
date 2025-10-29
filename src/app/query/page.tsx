import { QueryPageClient } from "./page-client";

export default async function QueryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  if (!q || Array.isArray(q)) return;

  const query = decodeURIComponent(q);

  return <QueryPageClient query={query} />;
}
