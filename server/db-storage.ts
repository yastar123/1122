import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, ilike, or } from "drizzle-orm";
import { users, settings, prizes, participants, submissions, storeAddresses, productCatalog } from "@shared/schema";
import type { User, InsertUser, Settings, InsertSettings, Prize, InsertPrize, Participant, InsertParticipant, Submission, InsertSubmission, StoreAddress, InsertStoreAddress, ProductCatalog, InsertProductCatalog } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";
import { type IStorage } from "./storage";

const MemoryStore = createMemoryStore(session);
const PgSession = ConnectPgSimple(session);

export class DatabaseStorage implements IStorage {
  private db;
  private pool: Pool;
  public sessionStore: session.Store;

  constructor() {
    // Use regular PostgreSQL instead of Neon
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool, { 
      schema: { 
        users, 
        settings, 
        prizes, 
        participants, 
        submissions, 
        storeAddresses, 
        productCatalog 
      } 
    });
    
    // Use PostgreSQL session store
    this.sessionStore = new PgSession({
      pool: this.pool,
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      ...user,
      createdAt: new Date(),
    };
    await this.db.insert(users).values(newUser);
    return newUser;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<boolean> {
    try {
      const result = await this.db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
      return (result as any).rowCount > 0;
    } catch (error) {
      return false;
    }
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    const result = await this.db.select().from(settings).limit(1);
    return result[0];
  }

  async updateSettings(settingsData: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const updated = { 
        ...settingsData, 
        id: existing.id, 
        updatedAt: new Date(),
        siteTitle: settingsData.siteTitle || existing.siteTitle,
        siteSubtitle: settingsData.siteSubtitle || existing.siteSubtitle
      };
      await this.db.update(settings).set(updated).where(eq(settings.id, existing.id));
      return updated as Settings;
    } else {
      const newSettings: Settings = {
        id: randomUUID(),
        siteTitle: settingsData.siteTitle || "Cek Kupon Undian",
        siteSubtitle: settingsData.siteSubtitle || "Sistem Undian Kupon",
        logoUrl: settingsData.logoUrl || null,
        bannerUrl: settingsData.bannerUrl || null,
        adminWhatsApp: settingsData.adminWhatsApp || null,
        mapsLink: settingsData.mapsLink || null,
        termsAndConditions: settingsData.termsAndConditions || null,
        winnerMessage: settingsData.winnerMessage || null,
        couponPlaceholder: settingsData.couponPlaceholder || "Tulis Nomor kuponmu disini",
        namePlaceholder: settingsData.namePlaceholder || "Nama Lengkap",
        whatsappPlaceholder: settingsData.whatsappPlaceholder || "Nomor Whatsapp",
        updatedAt: new Date(),
      };
      await this.db.insert(settings).values(newSettings);
      return newSettings;
    }
  }

  // Prize methods
  async getAllPrizes(): Promise<Prize[]> {
    return await this.db.select().from(prizes);
  }

  async getPrize(id: string): Promise<Prize | undefined> {
    const result = await this.db.select().from(prizes).where(eq(prizes.id, id));
    return result[0];
  }

  async createPrize(prize: InsertPrize): Promise<Prize> {
    const newPrize: Prize = {
      id: randomUUID(),
      name: prize.name,
      couponNumber: prize.couponNumber,
      description: prize.description ?? null,
      bannerUrl: prize.bannerUrl ?? null,
      startDate: prize.startDate,
      endDate: prize.endDate,
      isActive: prize.isActive ?? true,
      createdAt: new Date(),
    };
    await this.db.insert(prizes).values(newPrize);
    return newPrize;
  }

  async updatePrize(id: string, prizeData: Partial<InsertPrize>): Promise<Prize> {
    await this.db.update(prizes).set(prizeData).where(eq(prizes.id, id));
    const updated = await this.getPrize(id);
    if (!updated) throw new Error("Prize not found");
    return updated;
  }

  async deletePrize(id: string): Promise<boolean> {
    try {
      // First, delete all participants referencing this prize
      await this.db.delete(participants).where(eq(participants.prizeId, id));
      
      // Then, delete all submissions referencing this prize
      await this.db.delete(submissions).where(eq(submissions.prizeId, id));
      
      // Finally, delete the prize itself
      const result = await this.db.delete(prizes).where(eq(prizes.id, id));
      return (result as any).rowCount > 0;
    } catch (error) {
      console.error('Error deleting prize:', error);
      return false;
    }
  }

  // Participant methods
  async getAllParticipants(): Promise<Participant[]> {
    return await this.db.select().from(participants);
  }

  async getParticipant(id: string): Promise<Participant | undefined> {
    const result = await this.db.select().from(participants).where(eq(participants.id, id));
    return result[0];
  }

  async getParticipantByCoupon(couponNumber: string): Promise<Participant | undefined> {
    const result = await this.db.select().from(participants).where(eq(participants.couponNumber, couponNumber));
    return result[0];
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const newParticipant: Participant = {
      id: randomUUID(),
      couponNumber: participant.couponNumber,
      fullName: participant.fullName,
      whatsappNumber: participant.whatsappNumber,
      prizeId: participant.prizeId || null,
      prizeName: participant.prizeName || null,
      isWinner: participant.isWinner || null,
      isPrizeClaimed: participant.isPrizeClaimed || null,
      notes: participant.notes || null,
      createdAt: new Date(),
    };
    await this.db.insert(participants).values(newParticipant);
    return newParticipant;
  }

  async updateParticipant(id: string, participantData: Partial<InsertParticipant>): Promise<Participant> {
    await this.db.update(participants).set(participantData).where(eq(participants.id, id));
    const updated = await this.getParticipant(id);
    if (!updated) throw new Error("Participant not found");
    return updated;
  }

  async deleteParticipant(id: string): Promise<boolean> {
    const result = await this.db.delete(participants).where(eq(participants.id, id));
    return (result as any).rowCount > 0;
  }

  // Submission methods
  async getAllSubmissions(): Promise<Submission[]> {
    return await this.db.select().from(submissions);
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const newSubmission: Submission = {
      id: randomUUID(),
      couponNumber: submission.couponNumber,
      fullName: submission.fullName,
      whatsappNumber: submission.whatsappNumber,
      prizeId: submission.prizeId || null,
      prizeName: submission.prizeName || null,
      isWinner: submission.isWinner || null,
      submittedAt: new Date(),
    };
    await this.db.insert(submissions).values(newSubmission);
    return newSubmission;
  }

  async searchSubmissions(query: string): Promise<Submission[]> {
    return await this.db.select().from(submissions).where(
      or(
        ilike(submissions.fullName, `%${query}%`),
        ilike(submissions.couponNumber, `%${query}%`),
        ilike(submissions.whatsappNumber, `%${query}%`),
        ilike(submissions.prizeName, `%${query}%`)
      )
    );
  }

  // Store Address methods - NOW IMPLEMENTED
  async getAllStoreAddresses(): Promise<StoreAddress[]> {
    return await this.db.select().from(storeAddresses);
  }

  async getStoreAddress(id: string): Promise<StoreAddress | undefined> {
    const result = await this.db.select().from(storeAddresses).where(eq(storeAddresses.id, id));
    return result[0];
  }

  async createStoreAddress(storeAddress: InsertStoreAddress): Promise<StoreAddress> {
    const newStoreAddress: StoreAddress = {
      id: randomUUID(),
      name: storeAddress.name,
      address: storeAddress.address,
      phone: storeAddress.phone || null,
      whatsapp: storeAddress.whatsapp || null,
      openingHours: storeAddress.openingHours || null,
      mapsLink: storeAddress.mapsLink || null,
      isActive: storeAddress.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.insert(storeAddresses).values(newStoreAddress);
    return newStoreAddress;
  }

  async updateStoreAddress(id: string, storeAddressData: Partial<InsertStoreAddress>): Promise<StoreAddress> {
    const updateData = { ...storeAddressData, updatedAt: new Date() };
    await this.db.update(storeAddresses).set(updateData).where(eq(storeAddresses.id, id));
    const updated = await this.getStoreAddress(id);
    if (!updated) throw new Error("Store address not found");
    return updated;
  }

  async deleteStoreAddress(id: string): Promise<boolean> {
    const result = await this.db.delete(storeAddresses).where(eq(storeAddresses.id, id));
    return (result as any).rowCount > 0;
  }

  // Product Catalog methods - NOW IMPLEMENTED
  async getAllProducts(): Promise<ProductCatalog[]> {
    return await this.db.select().from(productCatalog);
  }

  async getProduct(id: string): Promise<ProductCatalog | undefined> {
    const result = await this.db.select().from(productCatalog).where(eq(productCatalog.id, id));
    return result[0];
  }

  async createProduct(product: InsertProductCatalog): Promise<ProductCatalog> {
    const newProduct: ProductCatalog = {
      id: randomUUID(),
      name: product.name,
      description: product.description || null,
      price: product.price || null,
      imageUrl: product.imageUrl || null,
      category: product.category || null,
      isAvailable: product.isAvailable || null,
      isActive: product.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.insert(productCatalog).values(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, productData: Partial<InsertProductCatalog>): Promise<ProductCatalog> {
    const updateData = { ...productData, updatedAt: new Date() };
    await this.db.update(productCatalog).set(updateData).where(eq(productCatalog.id, id));
    const updated = await this.getProduct(id);
    if (!updated) throw new Error("Product not found");
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db.delete(productCatalog).where(eq(productCatalog.id, id));
    return (result as any).rowCount > 0;
  }
}