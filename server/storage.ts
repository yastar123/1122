import { type User, type InsertUser, type Settings, type InsertSettings, type Prize, type InsertPrize, type Participant, type InsertParticipant, type Submission, type InsertSubmission, type StoreAddress, type InsertStoreAddress, type ProductCatalog, type InsertProductCatalog } from "@shared/schema";
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
  updateUserPassword(id: string, hashedPassword: string): Promise<boolean>;
  
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
  
  // Store Address methods
  getAllStoreAddresses(): Promise<StoreAddress[]>;
  getStoreAddress(id: string): Promise<StoreAddress | undefined>;
  createStoreAddress(storeAddress: InsertStoreAddress): Promise<StoreAddress>;
  updateStoreAddress(id: string, storeAddress: Partial<InsertStoreAddress>): Promise<StoreAddress>;
  deleteStoreAddress(id: string): Promise<boolean>;
  
  // Product Catalog methods
  getAllProducts(): Promise<ProductCatalog[]>;
  getProduct(id: string): Promise<ProductCatalog | undefined>;
  createProduct(product: InsertProductCatalog): Promise<ProductCatalog>;
  updateProduct(id: string, product: Partial<InsertProductCatalog>): Promise<ProductCatalog>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private settings: Settings | null;
  private prizes: Map<string, Prize>;
  private participants: Map<string, Participant>;
  private submissions: Map<string, Submission>;
  private storeAddresses: Map<string, StoreAddress>;
  private products: Map<string, ProductCatalog>;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.settings = null;
    this.prizes = new Map();
    this.participants = new Map();
    this.submissions = new Map();
    this.storeAddresses = new Map();
    this.products = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize default admin user
    this.initializeDefaultAdmin();
    
    // Initialize dummy data for testing
    this.initializeDummyData();
    
    // Initialize dummy store addresses and products
    this.initializeStoreData();
    
    // Initialize default settings
    this.settings = {
      id: randomUUID(),
      siteTitle: "Cek Kupon Undian",
      siteSubtitle: "Sistem Undian Kupon",
      logoUrl: null,
      bannerUrl: null,
      adminWhatsApp: "6281234567890",
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
      couponPlaceholder: "Tulis Nomor kuponmu disini",
      namePlaceholder: "Nama Lengkap", 
      whatsappPlaceholder: "Nomor Whatsapp",
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
        couponNumber: "TUM001",
        description: "Tumblr cantik untuk hadiah juara",
        bannerUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        isActive: true
      },
      {
        name: "HOODIE",
        couponNumber: "HOO001",
        description: "Hoodie premium berkualitas tinggi",
        bannerUrl: "https://images.unsplash.com/photo-1556821840-3a9fbc0cd826?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        isActive: true
      },
      {
        name: "TOTEBAG",
        couponNumber: "TOT001",
        description: "Totebag canvas premium untuk belanja",
        bannerUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
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
        couponNumber: prize.couponNumber,
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
      { couponNumber: "12345678", fullName: "Budi Santoso", whatsappNumber: "081234567890", isWinner: true, prizeId: prizeIds[0], prizeName: "TUMBLR", isPrizeClaimed: false, notes: "Pemenang pertama tumblr" },
      { couponNumber: "87654321", fullName: "Siti Nurhaliza", whatsappNumber: "081234567891", isWinner: true, prizeId: prizeIds[1], prizeName: "HOODIE", isPrizeClaimed: true, notes: "Pemenang hoodie" },
      { couponNumber: "11223344", fullName: "Ahmad Rahman", whatsappNumber: "081234567892", isWinner: true, prizeId: prizeIds[2], prizeName: "TOTEBAG", isPrizeClaimed: false, notes: "Pemenang totebag" },
      { couponNumber: "55667788", fullName: "Maya Sari", whatsappNumber: "081234567893", isWinner: false, prizeId: null, prizeName: null, isPrizeClaimed: false, notes: "Tidak beruntung kali ini" },
      { couponNumber: "99887766", fullName: "Dani Wijaya", whatsappNumber: "081234567894", isWinner: false, prizeId: null, prizeName: null, isPrizeClaimed: false, notes: "Coba lagi" },
      { couponNumber: "44556677", fullName: "Rina Kusuma", whatsappNumber: "081234567895", isWinner: true, prizeId: prizeIds[0], prizeName: "TUMBLR", isPrizeClaimed: true, notes: "Pemenang tumblr kedua" },
      { couponNumber: "33445566", fullName: "Agus Pratama", whatsappNumber: "081234567896", isWinner: false, prizeId: null, prizeName: null, isPrizeClaimed: false, notes: null },
      { couponNumber: "22334455", fullName: "Lina Dewi", whatsappNumber: "081234567897", isWinner: true, prizeId: prizeIds[1], prizeName: "HOODIE", isPrizeClaimed: false, notes: "Pemenang hoodie kedua" },
    ];

    for (const participant of participants) {
      const id = randomUUID();
      const participantData: Participant = {
        id,
        couponNumber: participant.couponNumber,
        fullName: participant.fullName,
        whatsappNumber: participant.whatsappNumber,
        isWinner: participant.isWinner,
        prizeId: participant.prizeId,
        prizeName: participant.prizeName,
        isPrizeClaimed: participant.isPrizeClaimed,
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

  async updateUserPassword(id: string, hashedPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }
    const updatedUser = { ...user, password: hashedPassword };
    this.users.set(id, updatedUser);
    return true;
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settings || undefined;
  }

  async updateSettings(newSettings: InsertSettings): Promise<Settings> {
    this.settings = {
      id: this.settings?.id || randomUUID(),
      siteTitle: newSettings.siteTitle || this.settings?.siteTitle || "Cek Kupon Undian",
      siteSubtitle: newSettings.siteSubtitle || this.settings?.siteSubtitle || "Sistem Undian Kupon",
      logoUrl: newSettings.logoUrl !== undefined ? newSettings.logoUrl : this.settings?.logoUrl || null,
      bannerUrl: newSettings.bannerUrl !== undefined ? newSettings.bannerUrl : this.settings?.bannerUrl || null,
      adminWhatsApp: newSettings.adminWhatsApp !== undefined ? newSettings.adminWhatsApp : this.settings?.adminWhatsApp || null,
      mapsLink: newSettings.mapsLink !== undefined ? newSettings.mapsLink : this.settings?.mapsLink || null,
      termsAndConditions: newSettings.termsAndConditions !== undefined ? newSettings.termsAndConditions : this.settings?.termsAndConditions || null,
      winnerMessage: newSettings.winnerMessage !== undefined ? newSettings.winnerMessage : this.settings?.winnerMessage || null,
      couponPlaceholder: newSettings.couponPlaceholder !== undefined ? newSettings.couponPlaceholder : this.settings?.couponPlaceholder || "Tulis Nomor kuponmu disini",
      namePlaceholder: newSettings.namePlaceholder !== undefined ? newSettings.namePlaceholder : this.settings?.namePlaceholder || "Nama Lengkap",
      whatsappPlaceholder: newSettings.whatsappPlaceholder !== undefined ? newSettings.whatsappPlaceholder : this.settings?.whatsappPlaceholder || "Nomor Whatsapp",
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
      couponNumber: insertPrize.couponNumber,
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
    try {
      // First, delete all participants referencing this prize
      const participantsToDelete: string[] = [];
      for (const [participantId, participant] of this.participants.entries()) {
        if (participant.prizeId === id) {
          participantsToDelete.push(participantId);
        }
      }
      participantsToDelete.forEach(participantId => this.participants.delete(participantId));
      
      // Then, delete all submissions referencing this prize
      const submissionsToDelete: string[] = [];
      for (const [submissionId, submission] of this.submissions.entries()) {
        if (submission.prizeId === id) {
          submissionsToDelete.push(submissionId);
        }
      }
      submissionsToDelete.forEach(submissionId => this.submissions.delete(submissionId));
      
      // Finally, delete the prize itself
      return this.prizes.delete(id);
    } catch (error) {
      console.error('Error deleting prize:', error);
      return false;
    }
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
      fullName: insertParticipant.fullName,
      whatsappNumber: insertParticipant.whatsappNumber,
      isWinner: insertParticipant.isWinner || null,
      prizeId: insertParticipant.prizeId || null,
      prizeName: insertParticipant.prizeName || null,
      isPrizeClaimed: insertParticipant.isPrizeClaimed || null,
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

  private async initializeStoreData() {
    // Initialize dummy store addresses
    const storeAddresses = [
      {
        name: "ConnectPrinting Pusat",
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        phone: "021-1234567",
        whatsapp: "6281234567890",
        openingHours: "Senin - Sabtu: 08:00 - 17:00",
        mapsLink: "https://maps.google.com/example1",
        isActive: true
      },
      {
        name: "ConnectPrinting Cabang Selatan",
        address: "Jl. TB Simatupang No. 456, Jakarta Selatan",
        phone: "021-7654321",
        whatsapp: "6281234567891",
        openingHours: "Senin - Jumat: 09:00 - 18:00",
        mapsLink: "https://maps.google.com/example2",
        isActive: true
      }
    ];

    for (const store of storeAddresses) {
      const id = randomUUID();
      const storeData: StoreAddress = {
        id,
        name: store.name,
        address: store.address,
        phone: store.phone,
        whatsapp: store.whatsapp,
        openingHours: store.openingHours,
        mapsLink: store.mapsLink,
        isActive: store.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.storeAddresses.set(id, storeData);
    }

    // Initialize dummy products
    const products = [
      {
        name: "Banner Custom",
        description: "Banner berkualitas tinggi dengan desain custom sesuai kebutuhan",
        price: "Rp 50.000 - 200.000",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
        category: "Advertising",
        isAvailable: true,
        isActive: true
      },
      {
        name: "Sticker Vinyl",
        description: "Sticker vinyl tahan air dengan berbagai ukuran dan bentuk",
        price: "Rp 5.000 - 50.000",
        imageUrl: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=300&fit=crop",
        category: "Sticker",
        isAvailable: true,
        isActive: true
      },
      {
        name: "Kaos Custom",
        description: "Kaos custom dengan sablon berkualitas tinggi",
        price: "Rp 75.000 - 150.000",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        category: "Apparel",
        isAvailable: true,
        isActive: true
      },
      {
        name: "Kartu Nama",
        description: "Kartu nama profesional dengan berbagai pilihan kertas",
        price: "Rp 100.000 / 1000 pcs",
        imageUrl: "https://images.unsplash.com/photo-1541348263662-e1aa84d8d4d9?w=400&h=300&fit=crop",
        category: "Business Cards",
        isAvailable: true,
        isActive: true
      }
    ];

    for (const product of products) {
      const id = randomUUID();
      const productData: ProductCatalog = {
        id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        isAvailable: product.isAvailable,
        isActive: product.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.set(id, productData);
    }
  }

  // Store Address methods
  async getAllStoreAddresses(): Promise<StoreAddress[]> {
    return Array.from(this.storeAddresses.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getStoreAddress(id: string): Promise<StoreAddress | undefined> {
    return this.storeAddresses.get(id);
  }

  async createStoreAddress(insertStoreAddress: InsertStoreAddress): Promise<StoreAddress> {
    const id = randomUUID();
    const storeAddress: StoreAddress = {
      id,
      name: insertStoreAddress.name,
      address: insertStoreAddress.address,
      phone: insertStoreAddress.phone || null,
      whatsapp: insertStoreAddress.whatsapp || null,
      openingHours: insertStoreAddress.openingHours || null,
      mapsLink: insertStoreAddress.mapsLink || null,
      isActive: insertStoreAddress.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.storeAddresses.set(id, storeAddress);
    return storeAddress;
  }

  async updateStoreAddress(id: string, updates: Partial<InsertStoreAddress>): Promise<StoreAddress> {
    const existing = this.storeAddresses.get(id);
    if (!existing) {
      throw new Error("Store address not found");
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.storeAddresses.set(id, updated);
    return updated;
  }

  async deleteStoreAddress(id: string): Promise<boolean> {
    return this.storeAddresses.delete(id);
  }

  // Product Catalog methods
  async getAllProducts(): Promise<ProductCatalog[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProduct(id: string): Promise<ProductCatalog | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProductCatalog): Promise<ProductCatalog> {
    const id = randomUUID();
    const product: ProductCatalog = {
      id,
      name: insertProduct.name,
      description: insertProduct.description || null,
      price: insertProduct.price || null,
      imageUrl: insertProduct.imageUrl || null,
      category: insertProduct.category || null,
      isAvailable: insertProduct.isAvailable || null,
      isActive: insertProduct.isActive || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProductCatalog>): Promise<ProductCatalog> {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

import { DatabaseStorage } from "./db-storage";

// Force DATABASE_URL jika tidak ada
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:EDUJUANDA12345@localhost:5432/coupon_lottery";
  console.log("🔧 DATABASE_URL set manually");
}

console.log("🚀 Using DatabaseStorage with PostgreSQL");
export const storage = new DatabaseStorage();