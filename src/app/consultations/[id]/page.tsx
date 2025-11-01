import { notFound } from "next/navigation";
import { getConsultationById } from "./_actions/getConsultationById";
import { ConsultationsPageClient } from "./page-client";

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log(id);
  const consultation = await getConsultationById(id);
  console.log(consultation);
  if (!consultation) notFound();

  return <ConsultationsPageClient consultation={consultation} />;
}
