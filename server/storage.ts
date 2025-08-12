import { type User, type InsertUser, type Settings, type InsertSettings, type Prize, type InsertPrize, type Participant, type InsertParticipant, type Submission, type InsertSubmission } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  
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
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.settings = null;
    this.prizes = new Map();
    this.participants = new Map();
    this.submissions = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize default admin user
    this.initializeDefaultAdmin();
    
    // Initialize dummy data for testing
    this.initializeDummyData();
    
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

  private async initializeDefaultAdmin() {
    // Create default admin user with specified credentials
    const { scrypt, randomBytes } = await import("crypto");
    const { promisify } = await import("util");
    const scryptAsync = promisify(scrypt);
    
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync("admin123", salt, 64)) as Buffer;
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      createdAt: new Date(),
    };
    
    this.users.set(adminId, adminUser);
  }

  private async initializeDummyData() {
    // Add dummy prizes
    const prizes = [
      {
        name: "TUMBLR",
        description: "Tumblr cantik untuk hadiah juara",
        bannerUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-12-31"),
        isActive: true
      },
      {
        name: "HOODIE",
        description: "Hoodie premium berkualitas tinggi",
        bannerUrl: "https://images.unsplash.com/photo-1556821840-3a9fbc0cd826?w=300&h=200&fit=crop",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-12-31"),
        isActive: true
      },
      {
        name: "TOTEBAG",
        description: "Totebag canvas premium untuk belanja",
        bannerUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        startDate: new Date("2024-08-01"),
        endDate: new Date("2024-12-31"),
        isActive: true
      }
    ];

    const prizeIds: string[] = [];
    for (const prize of prizes) {
      const id = randomUUID();
      prizeIds.push(id);
      const prizeData: Prize = {
        id,
        name: prize.name,
        description: prize.description,
        bannerUrl: prize.bannerUrl,
        startDate: prize.startDate,
        endDate: prize.endDate,
        isActive: prize.isActive,
        createdAt: new Date(),
      };
      this.prizes.set(id, prizeData);
    }

    // Add dummy participants/winners
    const participants = [
      { couponNumber: "12345678", isWinner: true, prizeId: prizeIds[0], notes: "Pemenang pertama tumblr" },
      { couponNumber: "87654321", isWinner: true, prizeId: prizeIds[1], notes: "Pemenang hoodie" },
      { couponNumber: "11223344", isWinner: true, prizeId: prizeIds[2], notes: "Pemenang totebag" },
      { couponNumber: "55667788", isWinner: false, prizeId: null, notes: "Tidak beruntung kali ini" },
      { couponNumber: "99887766", isWinner: false, prizeId: null, notes: "Coba lagi" },
      { couponNumber: "44556677", isWinner: true, prizeId: prizeIds[0], notes: "Pemenang tumblr kedua" },
      { couponNumber: "33445566", isWinner: false, prizeId: null, notes: null },
      { couponNumber: "22334455", isWinner: true, prizeId: prizeIds[1], notes: "Pemenang hoodie kedua" },
    ];

    for (const participant of participants) {
      const id = randomUUID();
      const participantData: Participant = {
        id,
        couponNumber: participant.couponNumber,
        isWinner: participant.isWinner,
        prizeId: participant.prizeId,
        notes: participant.notes,
        createdAt: new Date(),
      };
      this.participants.set(id, participantData);
    }

    // Add dummy submissions (user form submissions)
    const submissions = [
      { couponNumber: "12345678", fullName: "Budi Santoso", whatsappNumber: "081234567890", isWinner: true, prizeId: prizeIds[0], prizeName: "TUMBLR" },
      { couponNumber: "87654321", fullName: "Siti Nurhaliza", whatsappNumber: "081234567891", isWinner: true, prizeId: prizeIds[1], prizeName: "HOODIE" },
      { couponNumber: "11223344", fullName: "Ahmad Rahman", whatsappNumber: "081234567892", isWinner: true, prizeId: prizeIds[2], prizeName: "TOTEBAG" },
      { couponNumber: "55667788", fullName: "Maya Sari", whatsappNumber: "081234567893", isWinner: false, prizeId: null, prizeName: null },
      { couponNumber: "99887766", fullName: "Dani Wijaya", whatsappNumber: "081234567894", isWinner: false, prizeId: null, prizeName: null },
      { couponNumber: "44556677", fullName: "Rina Kusuma", whatsappNumber: "081234567895", isWinner: true, prizeId: prizeIds[0], prizeName: "TUMBLR" },
      { couponNumber: "33445566", fullName: "Agus Pratama", whatsappNumber: "081234567896", isWinner: false, prizeId: null, prizeName: null },
      { couponNumber: "22334455", fullName: "Lina Dewi", whatsappNumber: "081234567897", isWinner: true, prizeId: prizeIds[1], prizeName: "HOODIE" },
      { couponNumber: "98765432", fullName: "Rudi Hartono", whatsappNumber: "081234567898", isWinner: false, prizeId: null, prizeName: null },
      { couponNumber: "13579246", fullName: "Dewi Lestari", whatsappNumber: "081234567899", isWinner: false, prizeId: null, prizeName: null },
    ];

    for (const submission of submissions) {
      const id = randomUUID();
      const submissionData: Submission = {
        id,
        couponNumber: submission.couponNumber,
        fullName: submission.fullName,
        whatsappNumber: submission.whatsappNumber,
        isWinner: submission.isWinner,
        prizeId: submission.prizeId,
        prizeName: submission.prizeName,
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      };
      this.submissions.set(id, submissionData);
    }
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
      siteTitle: newSettings.siteTitle || this.settings?.siteTitle || "Cek Kupon Undian",
      logoUrl: newSettings.logoUrl !== undefined ? newSettings.logoUrl : this.settings?.logoUrl || null,
      bannerUrl: newSettings.bannerUrl !== undefined ? newSettings.bannerUrl : this.settings?.bannerUrl || null,
      adminWhatsApp: newSettings.adminWhatsApp !== undefined ? newSettings.adminWhatsApp : this.settings?.adminWhatsApp || null,
      mapsLink: newSettings.mapsLink !== undefined ? newSettings.mapsLink : this.settings?.mapsLink || null,
      termsAndConditions: newSettings.termsAndConditions !== undefined ? newSettings.termsAndConditions : this.settings?.termsAndConditions || null,
      winnerMessage: newSettings.winnerMessage !== undefined ? newSettings.winnerMessage : this.settings?.winnerMessage || null,
      updatedAt: new Date(),
    };
    return this.settings!;
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
      id,
      name: insertPrize.name,
      description: insertPrize.description || null,
      bannerUrl: insertPrize.bannerUrl || null,
      startDate: insertPrize.startDate,
      endDate: insertPrize.endDate,
      isActive: insertPrize.isActive || null,
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
      id,
      couponNumber: insertParticipant.couponNumber,
      isWinner: insertParticipant.isWinner || null,
      prizeId: insertParticipant.prizeId || null,
      notes: insertParticipant.notes || null,
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
      id,
      couponNumber: insertSubmission.couponNumber,
      fullName: insertSubmission.fullName,
      whatsappNumber: insertSubmission.whatsappNumber,
      isWinner: insertSubmission.isWinner || null,
      prizeId: insertSubmission.prizeId || null,
      prizeName: insertSubmission.prizeName || null,
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
