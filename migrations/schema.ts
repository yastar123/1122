import { pgTable, varchar, text, boolean, timestamp, unique, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const productCatalog = pgTable("product_catalog", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: text(),
	imageUrl: text("image_url"),
	category: text(),
	isAvailable: boolean("is_available").default(true),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const settings = pgTable("settings", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	siteTitle: text("site_title").default('Cek Kupon Undian').notNull(),
	siteSubtitle: text("site_subtitle").default('Sistem Undian Kupon').notNull(),
	logoUrl: text("logo_url"),
	bannerUrl: text("banner_url"),
	adminWhatsapp: text("admin_whatsapp"),
	mapsLink: text("maps_link"),
	termsAndConditions: text("terms_and_conditions"),
	winnerMessage: text("winner_message").default('Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)'),
	couponPlaceholder: text("coupon_placeholder").default('Tulis Nomor kuponmu disini'),
	namePlaceholder: text("name_placeholder").default('Nama Lengkap'),
	whatsappPlaceholder: text("whatsapp_placeholder").default('Nomor Whatsapp'),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const storeAddresses = pgTable("store_addresses", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	address: text().notNull(),
	phone: text(),
	whatsapp: text(),
	openingHours: text("opening_hours"),
	mapsLink: text("maps_link"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	username: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const prizes = pgTable("prizes", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: text().notNull(),
	couponNumber: text("coupon_number").notNull(),
	description: text(),
	bannerUrl: text("banner_url"),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("prizes_coupon_number_unique").on(table.couponNumber),
]);

export const participants = pgTable("participants", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	couponNumber: text("coupon_number").notNull(),
	fullName: text("full_name").notNull(),
	whatsappNumber: text("whatsapp_number").notNull(),
	prizeId: varchar("prize_id"),
	prizeName: text("prize_name"),
	isWinner: boolean("is_winner").default(false),
	isPrizeClaimed: boolean("is_prize_claimed").default(false),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.prizeId],
			foreignColumns: [prizes.id],
			name: "participants_prize_id_prizes_id_fk"
		}),
	unique("participants_coupon_number_unique").on(table.couponNumber),
]);

export const submissions = pgTable("submissions", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	couponNumber: text("coupon_number").notNull(),
	fullName: text("full_name").notNull(),
	whatsappNumber: text("whatsapp_number").notNull(),
	isWinner: boolean("is_winner").default(false),
	prizeId: varchar("prize_id"),
	prizeName: text("prize_name"),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.prizeId],
			foreignColumns: [prizes.id],
			name: "submissions_prize_id_prizes_id_fk"
		}),
]);
