CREATE TYPE "public"."landlord_status" AS ENUM('active', 'suspended', 'expired');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('bkash', 'nagad', 'sslcommerz', 'manual');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"landlord_id" uuid NOT NULL,
	"plan_name" text NOT NULL,
	"duration_months" integer NOT NULL,
	"amount_paid" integer NOT NULL,
	"transaction_id" text NOT NULL,
	"payment_method" "payment_method" DEFAULT 'sslcommerz',
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "landlords" ADD COLUMN "subscription_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "landlords" ADD COLUMN "status" "landlord_status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_landlord_id_landlords_id_fk" FOREIGN KEY ("landlord_id") REFERENCES "public"."landlords"("id") ON DELETE no action ON UPDATE no action;