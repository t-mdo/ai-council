ALTER TABLE "judgments" DROP CONSTRAINT "judgments_consultation_id_consultations_public_id_fk";
--> statement-breakpoint
ALTER TABLE "judgments" DROP COLUMN "consultation_id";
ALTER TABLE "judgments" ADD COLUMN "consultation_id" integer;
--> statement-breakpoint
ALTER TABLE "judgments" ADD CONSTRAINT "judgments_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;
