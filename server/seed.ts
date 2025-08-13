import { storage } from "./storage";

export async function seedData() {
  try {
    // Check if settings already exist
    const existingSettings = await storage.getSettings();
    if (!existingSettings || !existingSettings.adminWhatsApp) {
      await storage.updateSettings({
        siteTitle: "Cek Kupon Undian",
        logoUrl: null,
        bannerUrl: null,
        adminWhatsApp: "6281234567890",
        mapsLink: null,
        termsAndConditions: "Cara Klaim Hadiahmu*\nLangkah - langkah:\n1. Screenshot layar ini\n2. Datang ke ConnectPrinting\n3. Tunjukkan kupon fisik asli\n4. Hadiah bisa di ambil langsung\n5. Hadiah tidak bisa di kirim\n6. Berlaku s/d dokumentasi atlet GS Connect Printing\n7. Batas waktu klaim hadiah mulai 26 Agustus 22 – 7 September 22 09.00 – 16.30\n8. 1 orang 1 hadiah",
        winnerMessage: "Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)",
        couponPlaceholder: "Tulis Nomor kuponmu disini",
        namePlaceholder: "Nama Lengkap",
        whatsappPlaceholder: "Nomor Whatsapp",
      });
      console.log("Settings seeded successfully");
    }

    // Check if prizes already exist
    const existingPrizes = await storage.getAllPrizes();
    if (existingPrizes.length === 0) {
      await storage.createPrize({
        name: "TUMBLR",
        couponNumber: "TUM001",
        description: "Tumblr cantik untuk hadiah juara",
        bannerUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        isActive: true,
      });

      await storage.createPrize({
        name: "HOODIE",
        couponNumber: "HOO001",
        description: "Hoodie premium berkualitas tinggi",
        bannerUrl: "https://images.unsplash.com/photo-1556821840-3a9fbc0cd826?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        isActive: true,
      });

      await storage.createPrize({
        name: "TOTEBAG",
        couponNumber: "TOT001",
        description: "Totebag canvas premium untuk belanja",
        bannerUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        isActive: true,
      });

      console.log("Prizes seeded successfully");
    }

    // Create admin user if not exists
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const scrypt = await import("crypto");
      const salt = scrypt.randomBytes(16).toString("hex");
      const hashedPassword = scrypt.scryptSync("admin123", salt, 64).toString("hex");
      const password = `${hashedPassword}.${salt}`;

      await storage.createUser({
        username: "admin",
        email: "admin@gmail.com",
        password,
      });
      console.log("Admin user seeded successfully");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}