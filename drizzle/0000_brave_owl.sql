CREATE TYPE "public"."animal_event_type" AS ENUM('birth', 'weighing', 'vaccination', 'illness', 'treatment', 'production', 'reproductive_event', 'sale', 'death', 'observation');--> statement-breakpoint
CREATE TYPE "public"."animal_status" AS ENUM('active', 'sold', 'dead', 'sick');--> statement-breakpoint
CREATE TYPE "public"."medical_record_type" AS ENUM('vaccine', 'deworming', 'treatment', 'illness', 'checkup', 'surgery', 'other');--> statement-breakpoint
CREATE TYPE "public"."parent_relation" AS ENUM('father', 'mother');--> statement-breakpoint
CREATE TYPE "public"."reproductive_event" AS ENUM('heat', 'insemination', 'mounting', 'pregnancy_diagnosis', 'calving', 'abortion');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."shift" AS ENUM('morning', 'afternoon');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('bovine', 'equine');--> statement-breakpoint
CREATE TABLE "animal_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"event_type" "animal_event_type" NOT NULL,
	"event_date" date NOT NULL,
	"title" varchar(200),
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_parent_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"relation_type" "parent_relation" NOT NULL,
	"previous_animal_id" integer,
	"previous_text" varchar(200),
	"new_animal_id" integer,
	"new_text" varchar(200),
	"changed_at" timestamp DEFAULT now() NOT NULL,
	"changed_by" varchar(100) DEFAULT 'system',
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "animal_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"photo_data" "bytea" NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animals" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100),
	"species" "species" NOT NULL,
	"breed" varchar(100),
	"sex" "sex" NOT NULL,
	"birth_date" date,
	"status" "animal_status" DEFAULT 'active' NOT NULL,
	"marks" text,
	"current_weight" numeric(8, 2),
	"notes" text,
	"father_animal_id" integer,
	"father_text" varchar(200),
	"mother_animal_id" integer,
	"mother_text" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "animals_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "medical_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"record_type" "medical_record_type" NOT NULL,
	"date" date NOT NULL,
	"medication" varchar(200),
	"dose" varchar(100),
	"veterinarian" varchar(200),
	"next_check_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milk_production" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"date" date NOT NULL,
	"shift" "shift",
	"liters" numeric(6, 2) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reproductive_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"animal_id" integer NOT NULL,
	"event_type" "reproductive_event" NOT NULL,
	"date" date NOT NULL,
	"bull_code" varchar(100),
	"calving_animal_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
