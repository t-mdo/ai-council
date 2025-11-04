import { notFound } from "next/navigation";
import { getConsultationById } from "./_actions/getConsultationById";
import { ConsultationsPageClient } from "./page-client";

const judges = [
  {
    modelId: "anthropic/claude-sonnet-4.5",
    modelName: "Claude Sonnet 4.5",
    modelImagePath: "/images/anthropic.avif",
  },
  {
    modelId: "openai/gpt-5",
    modelName: "GPT 5",
    modelImagePath: "/images/openai.avif",
  },
  {
    modelId: "google/gemini-2.5-pro",
    modelName: "Gemini Pro 2.5",
    modelImagePath: "/images/google.avif",
  },
  {
    modelId: "xai/grok-4",
    modelName: "Grok 4",
    modelImagePath: "/images/xai.avif",
  },
];

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const consultation = await getConsultationById(id);
  if (!consultation) notFound();

  return (
    <ConsultationsPageClient
      consultation={consultation}
      judgments={consultation.judgments}
      judges={judges}
    />
  );
}
