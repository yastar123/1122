# Panduan Setup Website Sistem Undian Kupon

## Deskripsi Proyek

Website Sistem Undian Kupon adalah aplikasi web full-stack yang memungkinkan pengguna untuk:
- Mengecek nomor kupon untuk melihat apakah menang hadiah
- Melihat katalog produk dan alamat toko
- Admin dapat mengelola hadiah, peserta, dan pengaturan sistem

## Teknologi yang Digunakan

### Frontend
- **React 18** - Library JavaScript untuk membangun user interface
- **TypeScript** - Superset JavaScript dengan static typing
- **Tailwind CSS** - Utility-first CSS framework untuk styling
- **Shadcn/UI** - Koleksi komponen UI yang dapat di-copy paste
- **Wouter** - Router untuk navigasi halaman
- **TanStack Query** - Library untuk data fetching dan caching
- **Vite** - Build tool dan development server yang cepat

### Backend  
- **Node.js** - Runtime environment untuk JavaScript
- **Express.js** - Web framework untuk Node.js
- **TypeScript** - Type-safe development
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### Database
- **PostgreSQL** - Database relational
- **Drizzle ORM** - Type-safe ORM untuk TypeScript
- **@neondatabase/serverless** - PostgreSQL client untuk serverless

### UI Components & Styling
- **Radix UI** - Komponen UI primitives yang accessible
- **Lucide React** - Icon library
- **Class Variance Authority** - Utility untuk variant handling
- **Framer Motion** - Animation library

### Development Tools
- **TSX** - TypeScript execution environment
- **Drizzle Kit** - Database migration tools
- **PostCSS** - CSS processing tool

## Persyaratan Sistem

### Software yang Harus Diinstall

1. **Node.js** (versi 18 atau lebih baru)
   - Download dari: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Akan otomatis menginstall NPM (Node Package Manager)

2. **PostgreSQL** (versi 14 atau lebih baru)
   - Download dari: https://www.postgresql.org/download/
   - Atau gunakan Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres`

3. **Git** (untuk cloning repository)
   - Download dari: https://git-scm.com/

4. **Code Editor** (opsional tapi disarankan)
   - Visual Studio Code: https://code.visualstudio.com/
   - Extension yang disarankan: TypeScript, Tailwind CSS IntelliSense

## Cara Setup di Laptop

### 1. Clone Repository
```bash
git clone [URL_REPOSITORY]
cd coupon-lottery-system
```

### 2. Install Dependencies
```bash
# Install semua dependencies
npm install
```

### 3. Setup Database

#### Opsi A: PostgreSQL Lokal
```bash
# Buat database baru
createdb coupon_lottery

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/coupon_lottery"
```

#### Opsi B: Neon Database (Serverless)
1. Buat akun di https://neon.tech
2. Buat database baru
3. Copy connection string ke environment variable

### 4. Setup Environment Variables

Buat file `.env` di root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coupon_lottery"

# Session Secret (untuk keamanan session)
SESSION_SECRET="your-super-secret-session-key-here"

# Node Environment
NODE_ENV="development"

# Port (opsional, default 5000)
PORT=5000
```

### 5. Generate Database Schema
```bash
# Generate database tables
npm run db:generate

# Push schema ke database
npm run db:push

# Seed database dengan data sample (opsional)
npm run db:seed
```

### 6. Jalankan Development Server
```bash
# Start development server
npm run dev
```

Website akan tersedia di: http://localhost:5000

## Struktur Commands

```bash
# Development
npm run dev              # Menjalankan development server
npm run build           # Build untuk production
npm run start           # Menjalankan production server

# Database
npm run db:generate     # Generate migration files
npm run db:push         # Push schema ke database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database dengan sample data
npm run db:studio       # Buka database UI (Drizzle Studio)

# Code Quality
npm run type-check      # Type checking
npm run lint            # Linting
npm run format          # Code formatting
```

## Login Default

Setelah setup berhasil, gunakan kredensial berikut untuk login admin:
- **Email**: admin@gmail.com
- **Password**: admin123

## Struktur Folder

```
coupon-lottery-system/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main app component
│   └── index.html         # HTML template
├── server/                 # Backend Express app
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication logic
│   └── storage.ts         # Database operations
├── shared/                 # Shared code between client/server
│   └── schema.ts          # Database schema & types
├── package.json           # Dependencies & scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
├── drizzle.config.ts      # Database configuration
└── tsconfig.json          # TypeScript configuration
```

## Troubleshooting

### Port sudah digunakan
Jika port 5000 sudah digunakan, ubah di file `.env`:
```env
PORT=3000
```

### Database connection error
1. Pastikan PostgreSQL running
2. Cek connection string di `.env`
3. Pastikan database sudah dibuat

### NPM install error
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Build error
```bash
# Type check untuk cek error TypeScript
npm run type-check

# Clear Vite cache
rm -rf node_modules/.vite
```

## Production Deployment

### Vercel Deployment
1. Connect repository ke Vercel
2. Set environment variables di Vercel dashboard
3. Deploy otomatis dari main branch

### Manual Deployment
```bash
# Build aplikasi
npm run build

# Start production server
npm run start
```

## Dukungan

Jika mengalami masalah setup, cek:
1. Node.js version: `node --version` (harus 18+)
2. NPM version: `npm --version`
3. PostgreSQL running: `pg_isready`
4. Database connection: Test di database management tool

## Fitur Utama

### Public Pages
- **Homepage**: Form cek kupon, informasi hadiah
- **Store Addresses**: Daftar alamat toko
- **Product Catalog**: Katalog produk dengan filter dan search

### Admin Dashboard
- **Prize Management**: Kelola hadiah dan kupon pemenang
- **Participant Management**: Data peserta dan status klaim
- **Submission History**: Riwayat pengecekan kupon
- **Store Management**: Kelola alamat toko
- **Product Management**: Kelola katalog produk
- **Settings**: Konfigurasi aplikasi

Dokumentasi ini memberikan panduan lengkap untuk setup dan menjalankan website di laptop lokal. Ikuti langkah-langkah sesuai urutan untuk hasil terbaik.