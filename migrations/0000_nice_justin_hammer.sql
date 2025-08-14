CREATE TABLE "participants" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_number" text NOT NULL,
	"full_name" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"prize_id" varchar,
	"prize_name" text,
	"is_winner" boolean DEFAULT false,
	"is_prize_claimed" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "participants_coupon_number_unique" UNIQUE("coupon_number")
);
--> statement-breakpoint
CREATE TABLE "prizes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"coupon_number" text NOT NULL,
	"description" text,
	"banner_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "prizes_coupon_number_unique" UNIQUE("coupon_number")
);
--> statement-breakpoint
CREATE TABLE "product_catalog" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" text,
	"image_url" text,
	"category" text,
	"is_available" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_title" text DEFAULT 'Cek Kupon Undian' NOT NULL,
	"site_subtitle" text DEFAULT 'Sistem Undian Kupon' NOT NULL,
	"logo_url" text,
	"banner_url" text,
	"admin_whatsapp" text,
	"maps_link" text,
	"terms_and_conditions" text,
	"winner_message" text DEFAULT 'Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)',
	"coupon_placeholder" text DEFAULT 'Tulis Nomor kuponmu disini',
	"name_placeholder" text DEFAULT 'Nama Lengkap',
	"whatsapp_placeholder" text DEFAULT 'Nomor Whatsapp',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "store_addresses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text,
	"whatsapp" text,
	"opening_hours" text,
	"maps_link" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_number" text NOT NULL,
	"full_name" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"is_winner" boolean DEFAULT false,
	"prize_id" varchar,
	"prize_name" text,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_prize_id_prizes_id_fk" FOREIGN KEY ("prize_id") REFERENCES "public"."prizes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_prize_id_prizes_id_fk" FOREIGN KEY ("prize_id") REFERENCES "public"."prizes"("id") ON DELETE no action ON UPDATE no action;