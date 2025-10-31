CREATE TABLE "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"query" text NOT NULL,
	"responses" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "consultations_public_id_unique" UNIQUE("public_id")
);
