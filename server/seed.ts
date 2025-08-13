import { storage } from "./storage";

export async function seedData() {
  try {
    // Check if settings already exist
    const existingSettings = await storage.getSettings();
    if (!existingSettings) {
      await storage.updateSettings({
        siteTitle: "ConnectPrinting Undian Kupon",
        logoUrl: "",
        bannerUrl: "",
        mainTitle: "UNDIAN KUPON CONNECTPRINTING",
        subtitleText: "Masukkan nomor kupon dan data diri Anda untuk mengecek hadiah",
        formTitle: "Cek Nomor Kupon Anda",
        couponPlaceholder: "Masukkan nomor kupon",
        namePlaceholder: "Nama lengkap",
        whatsappPlaceholder: "Nomor WhatsApp",
        buttonText: "CEK KUPON",
        footerText: "© 2025 ConnectPrinting. Semua hak cipta dilindungi.",
        winnerMessage: "Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)",
        whatsappNumber: "6281234567890",
        whatsappMessage: "Halo, saya ingin menanyakan tentang undian kupon ConnectPrinting",
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