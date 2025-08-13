# Sistem Undian Kupon

Website sistem undian kupon yang memungkinkan pengguna mengecek nomor kupon untuk melihat hadiah, dengan dashboard admin lengkap untuk mengelola hadiah, peserta, dan produk.

## 🚀 Quick Start

### Persyaratan
- Node.js 18+
- PostgreSQL 14+
- Git

### Instalasi

```bash
# Clone repository
git clone [repository-url]
cd coupon-lottery-system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database connection string Anda

# Setup database
npm run db:push
npm run db:seed

# Jalankan development server
npm run dev
```

Website akan tersedia di: http://localhost:5000

## 🔑 Login Default
- Email: `admin@gmail.com`
- Password: `admin123`

## 🛠 Teknologi

### Frontend
- React 18 + TypeScript
- Tailwind CSS + Shadcn/UI
- TanStack Query
- Wouter (Router)
- Vite

### Backend
- Express.js + TypeScript
- PostgreSQL + Drizzle ORM
- Passport.js Authentication
- Session Management

## 📁 Struktur Folder

```
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components  
│   │   └── hooks/      # Custom hooks
├── server/             # Express backend
│   ├── routes.ts       # API endpoints
│   ├── auth.ts         # Authentication
│   └── storage.ts      # Database operations
├── shared/             # Shared types & schema
└── package.json        # Dependencies
```

## 🎯 Fitur

### Halaman Publik
- ✅ Cek kupon pemenang
- ✅ Katalog produk dengan filter
- ✅ Daftar alamat toko
- ✅ Responsive design

### Admin Dashboard
- ✅ Manajemen hadiah & kupon
- ✅ Data peserta & status klaim
- ✅ Riwayat pengecekan kupon
- ✅ Kelola alamat toko
- ✅ Kelola katalog produk
- ✅ Pengaturan sistem

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Production server
npm run db:push      # Update database schema
npm run db:seed      # Seed sample data
npm run db:studio    # Database UI
```

## 🐛 Troubleshooting

**Port sudah digunakan:**
```bash
# Ubah port di .env
PORT=3000
```

**Database error:**
```bash
# Cek PostgreSQL running
pg_isready

# Reset database
npm run db:push --force
```

**Build error:**
```bash
# Clear cache
rm -rf node_modules/.vite
npm install
```

## 📚 Dokumentasi Lengkap

Untuk panduan setup detail dan troubleshooting lengkap, lihat [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🔧 Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/coupon_lottery
SESSION_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

---

Dibuat dengan ❤️ menggunakan Replit