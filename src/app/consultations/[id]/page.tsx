import { notFound } from "next/navigation";
import { getConsultationById } from "./_actions/getConsultationById";
import { ConsultationsPageClient } from "./page-client";

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const consultation = await getConsultationById(id);
  if (!consultation) notFound();

  return <ConsultationsPageClient consultation={consultation} />;
}
