ALTER TABLE "flats" ALTER COLUMN "service_charge" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "flats" ALTER COLUMN "service_charge" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rent_payments" ALTER COLUMN "amount_due" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "rent_payments" ALTER COLUMN "amount_due" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_payments" ALTER COLUMN "amount_paid" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "rent_payments" ALTER COLUMN "amount_paid" DROP DEFAULT;