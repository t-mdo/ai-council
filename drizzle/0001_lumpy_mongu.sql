CREATE TABLE "judges" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" text NOT NULL,
	"model_name" text NOT NULL,
	"model_image_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "judges_model_id_unique" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE "judgments" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_id" uuid NOT NULL,
	"judge_id" integer NOT NULL,
	"status" text DEFAULT 'initial' NOT NULL,
	"full_answer" text,
	"answer" text,
	"answer_color" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_consultation_judge" UNIQUE("consultation_id","judge_id")
);
--> statement-breakpoint
ALTER TABLE "judgments" ADD CONSTRAINT "judgments_consultation_id_consultations_public_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("public_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "judgments" ADD CONSTRAINT "judgments_judge_id_judges_id_fk" FOREIGN KEY ("judge_id") REFERENCES "public"."judges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" DROP COLUMN "responses";