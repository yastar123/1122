import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
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
  public sessionStore: session.Store;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql, { schema: { users, settings, prizes, participants, submissions, storeAddresses, productCatalog } });
    
    // Use PostgreSQL session store for production or memory store for development
    if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
      this.sessionStore = new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      });
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000,
      });
    }
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

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    const result = await this.db.select().from(settings).limit(1);
    return result[0];
  }

  async updateSettings(settingsData: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const updated = { ...settingsData, id: existing.id, updatedAt: new Date() };
      await this.db.update(settings).set(updated).where(eq(settings.id, existing.id));
      return updated as Settings;
    } else {
      const newSettings: Settings = {
        id: randomUUID(),
        ...settingsData,
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
    const result = await this.db.delete(prizes).where(eq(prizes.id, id));
    return result.rowCount > 0;
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
      ...participant,
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
    return result.rowCount > 0;
  }

  // Submission methods
  async getAllSubmissions(): Promise<Submission[]> {
    return await this.db.select().from(submissions);
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const newSubmission: Submission = {
      id: randomUUID(),
      ...submission,
      submittedAt: new Date(),
    };
    await this.db.insert(submissions).values(newSubmission);
    return newSubmission;
  }

  async searchSubmissions(query: string): Promise<Submission[]> {
    // For now, return all submissions. Could be enhanced with filtering logic
    return await this.getAllSubmissions();
  }

  // Store Address methods - placeholder implementations
  async getAllStoreAddresses(): Promise<StoreAddress[]> {
    return [];
  }

  async getStoreAddress(id: string): Promise<StoreAddress | undefined> {
    return undefined;
  }

  async createStoreAddress(storeAddress: InsertStoreAddress): Promise<StoreAddress> {
    throw new Error("Store address operations not yet implemented for database storage");
  }

  async updateStoreAddress(id: string, storeAddress: Partial<InsertStoreAddress>): Promise<StoreAddress> {
    throw new Error("Store address operations not yet implemented for database storage");
  }

  async deleteStoreAddress(id: string): Promise<boolean> {
    return false;
  }

  // Product Catalog methods - placeholder implementations
  async getAllProducts(): Promise<ProductCatalog[]> {
    return [];
  }

  async getProduct(id: string): Promise<ProductCatalog | undefined> {
    return undefined;
  }

  async createProduct(product: InsertProductCatalog): Promise<ProductCatalog> {
    throw new Error("Product operations not yet implemented for database storage");
  }

  async updateProduct(id: string, product: Partial<InsertProductCatalog>): Promise<ProductCatalog> {
    throw new Error("Product operations not yet implemented for database storage");
  }

  async deleteProduct(id: string): Promise<boolean> {
    return false;
  }
}