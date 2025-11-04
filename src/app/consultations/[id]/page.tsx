import { notFound } from "next/navigation";
import { getConsultationById } from "./_actions/getConsultationById";
import { getJudges } from "./_actions/getJudges";
import { ConsultationsPageClient } from "./page-client";

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const consultation = await getConsultationById(id);
  if (!consultation) notFound();

  const judges = await getJudges();

  return (
    <ConsultationsPageClient
      consultation={consultation}
      judgments={consultation.judgments}
      judges={judges}
    />
  );
}
