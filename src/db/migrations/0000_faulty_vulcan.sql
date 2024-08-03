CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar NOT NULL,
	"customer_email" varchar NOT NULL,
	"due_date" timestamp,
	"order_status" varchar NOT NULL,
	"total" integer NOT NULL,
	"payment_status" varchar NOT NULL,
	"payment_method" varchar NOT NULL,
	"stripe_invoice_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
