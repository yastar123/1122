import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteTitle: text("site_title").notNull().default("Cek Kupon Undian"),
  siteSubtitle: text("site_subtitle").notNull().default("Sistem Undian Kupon"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  adminWhatsApp: text("admin_whatsapp"),
  mapsLink: text("maps_link"),
  termsAndConditions: text("terms_and_conditions"),
  winnerMessage: text("winner_message").default("Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)"),
  couponPlaceholder: text("coupon_placeholder").default("Tulis Nomor kuponmu disini"),
  namePlaceholder: text("name_placeholder").default("Nama Lengkap"),
  whatsappPlaceholder: text("whatsapp_placeholder").default("Nomor Whatsapp"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prizes = pgTable("prizes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  couponNumber: text("coupon_number").notNull().unique(),
  description: text("description"),
  bannerUrl: text("banner_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const participants = pgTable("participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponNumber: text("coupon_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  prizeId: varchar("prize_id").references(() => prizes.id),
  prizeName: text("prize_name"),
  isWinner: boolean("is_winner").default(false),
  isPrizeClaimed: boolean("is_prize_claimed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponNumber: text("coupon_number").notNull(),
  fullName: text("full_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  isWinner: boolean("is_winner").default(false),
  prizeId: varchar("prize_id").references(() => prizes.id),
  prizeName: text("prize_name"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const storeAddresses = pgTable("store_addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  openingHours: text("opening_hours"),
  mapsLink: text("maps_link"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productCatalog = pgTable("product_catalog", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price"),
  imageUrl: text("image_url"),
  category: text("category"),
  isAvailable: boolean("is_available").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertPrizeSchema = createInsertSchema(prizes).omit({
  id: true,
  createdAt: true,
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export const insertStoreAddressSchema = createInsertSchema(storeAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  openingHours: z.string().optional(),
  mapsLink: z.string().optional(),
});

export const insertProductCatalogSchema = createInsertSchema(productCatalog).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  description: z.string().optional(),
  price: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertPrize = z.infer<typeof insertPrizeSchema>;
export type Prize = typeof prizes.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertStoreAddress = z.infer<typeof insertStoreAddressSchema>;
export type StoreAddress = typeof storeAddresses.$inferSelect;
export type InsertProductCatalog = z.infer<typeof insertProductCatalogSchema>;
export type ProductCatalog = typeof productCatalog.$inferSelect;
