import { type User, type InsertUser, type Settings, type InsertSettings, type Prize, type InsertPrize, type Participant, type InsertParticipant, type Submission, type InsertSubmission } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
  
  // Prize methods
  getAllPrizes(): Promise<Prize[]>;
  getPrize(id: string): Promise<Prize | undefined>;
  createPrize(prize: InsertPrize): Promise<Prize>;
  updatePrize(id: string, prize: Partial<InsertPrize>): Promise<Prize>;
  deletePrize(id: string): Promise<boolean>;
  
  // Participant methods
  getAllParticipants(): Promise<Participant[]>;
  getParticipant(id: string): Promise<Participant | undefined>;
  getParticipantByCoupon(couponNumber: string): Promise<Participant | undefined>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  updateParticipant(id: string, participant: Partial<InsertParticipant>): Promise<Participant>;
  deleteParticipant(id: string): Promise<boolean>;
  
  // Submission methods
  getAllSubmissions(): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  searchSubmissions(query: string): Promise<Submission[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private settings: Settings | null;
  private prizes: Map<string, Prize>;
  private participants: Map<string, Participant>;
  private submissions: Map<string, Submission>;
  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.settings = null;
    this.prizes = new Map();
    this.participants = new Map();
    this.submissions = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize default settings
    this.settings = {
      id: randomUUID(),
      siteTitle: "Cek Kupon Undian",
      logoUrl: null,
      bannerUrl: null,
      adminWhatsApp: null,
      mapsLink: null,
      termsAndConditions: `Cara Klaim Hadiahmu*
Langkah - langkah:
1. Screenshot layar ini
2. Datang ke ConnectPrinting
3. Tunjukkan kupon fisik asli
4. Hadiah bisa di ambil langsung
5. Hadiah tidak bisa di kirim
6. Berlaku s/d dokumentasi atlet GS Connect Printing
7. Batas waktu klaim hadiah mulai 26 Agustus 22 – 7 September 22 09.00 – 16.30
8. 1 orang 1 hadiah`,
      winnerMessage: "Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)",
      updatedAt: new Date(),
    };
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settings || undefined;
  }

  async updateSettings(newSettings: InsertSettings): Promise<Settings> {
    this.settings = {
      id: this.settings?.id || randomUUID(),
      ...newSettings,
      updatedAt: new Date(),
    };
    return this.settings;
  }

  // Prize methods
  async getAllPrizes(): Promise<Prize[]> {
    return Array.from(this.prizes.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPrize(id: string): Promise<Prize | undefined> {
    return this.prizes.get(id);
  }

  async createPrize(insertPrize: InsertPrize): Promise<Prize> {
    const id = randomUUID();
    const prize: Prize = {
      ...insertPrize,
      id,
      createdAt: new Date(),
    };
    this.prizes.set(id, prize);
    return prize;
  }

  async updatePrize(id: string, updates: Partial<InsertPrize>): Promise<Prize> {
    const existing = this.prizes.get(id);
    if (!existing) {
      throw new Error("Prize not found");
    }
    const updated = { ...existing, ...updates };
    this.prizes.set(id, updated);
    return updated;
  }

  async deletePrize(id: string): Promise<boolean> {
    return this.prizes.delete(id);
  }

  // Participant methods
  async getAllParticipants(): Promise<Participant[]> {
    return Array.from(this.participants.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getParticipant(id: string): Promise<Participant | undefined> {
    return this.participants.get(id);
  }

  async getParticipantByCoupon(couponNumber: string): Promise<Participant | undefined> {
    return Array.from(this.participants.values()).find(
      (participant) => participant.couponNumber === couponNumber
    );
  }

  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const id = randomUUID();
    const participant: Participant = {
      ...insertParticipant,
      id,
      createdAt: new Date(),
    };
    this.participants.set(id, participant);
    return participant;
  }

  async updateParticipant(id: string, updates: Partial<InsertParticipant>): Promise<Participant> {
    const existing = this.participants.get(id);
    if (!existing) {
      throw new Error("Participant not found");
    }
    const updated = { ...existing, ...updates };
    this.participants.set(id, updated);
    return updated;
  }

  async deleteParticipant(id: string): Promise<boolean> {
    return this.participants.delete(id);
  }

  // Submission methods
  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort((a, b) => 
      new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
    );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async searchSubmissions(query: string): Promise<Submission[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.submissions.values()).filter(
      (submission) =>
        submission.fullName.toLowerCase().includes(lowerQuery) ||
        submission.couponNumber.toLowerCase().includes(lowerQuery) ||
        submission.whatsappNumber.includes(lowerQuery) ||
        (submission.prizeName && submission.prizeName.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => 
      new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
