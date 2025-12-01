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

  console.time("getConsultation");
  const consultation = await getConsultationById(id);
  console.timeEnd("getConsultation");
  if (!consultation) notFound();

  console.time("getJudges");
  const judges = await getJudges();
  console.timeEnd("getJudges");

  return (
    <ConsultationsPageClient
      consultation={consultation}
      judgments={consultation.judgments}
      judges={judges}
    />
  );
}
