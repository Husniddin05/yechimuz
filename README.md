# YechimUZ — Milliy Muammolar va Innovatsion Yechimlar Platformasi

YechimUZ — O'zbekiston hududlari, korxonalari va jamoatchilik oldida turgan dolzarb muammolarni sun'iy intellekt (AI) yordamida tuzilmaviy **Challenge**'larga aylantirish, malakali IT muhandislari va jamoalaridan amaliy yechimlar qabul qilish, mustaqil 9 mezonli ekspert baholash hamda pilot loyihalarni amalga oshirishga mo'ljallangan milliy web-platforma.

---

## 📑 Mundarija

1. [Texnologiyalar steki](#-texnologiyalar-steki)
2. [Loyiha arxitekturasi](#-loyiha-arxitekturasi)
3. [Lokal muhitda ishga tushirish](#-lokal-muhitda-ishga-tushirish)
4. [Konfiguratsiya (.env fayli)](#-konfiguratsiya-env-fayli)
5. [Zaxiralash va Qayta tiklash (Backup & Restore)](#-zaxiralash-va-qayta-tiklash-backup--restore)
6. [Production Deploy bo'yicha qo'llanma (Vercel + PostgreSQL)](#-production-deploy-boyicha-qollanma-vercel--postgresql)
7. [Avtomatlashtirilgan testlar](#-avtomatlashtirilgan-testlar)
8. [Xavfsizlik va RBAC tizimi](#-xavfsizlik-va-rbac-tizimi)

---

## 🚀 Texnologiyalar steki

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, Canvas-Confetti
- **Backend & API:** Next.js API Routes (`/api/v1/*`), Zod Validation Schemas, Clean Service Layer (`src/services/*`)
- **Ma'lumotlar bazasi & ORM:** Prisma ORM, SQLite (`dev.db` — lokal ishlab chiqish uchun) / PostgreSQL (Production uchun)
- **Autentifikatsiya & Xavfsizlik:** JWT (JSON Web Tokens), Role-Based Access Control (RBAC), bcryptjs, Middleware
- **Til & Muhit:** TypeScript, Node.js (v18+)

---

## 🏛 Loyiha arxitekturasi

Loyiha professional qatlamli (layered) arxitekturaga muvofiq tashkil etilgan:

```
startap amaliy/
├── _backups/                 # Ma'lumotlar bazasi va tizim zaxira nusxalari (Backups)
├── prisma/
│   ├── dev.db               # SQLite lokal ma'lumotlar bazasi
│   ├── schema.prisma        # Prisma DB modeli va munosabatlari
│   └── seed.ts              # Boshlang'ich hududlar, kategoriyalar va test foydalanuvchilar
├── src/
│   ├── app/                 # Next.js 14 App Router sahifalari va API endpointlar
│   │   ├── api/v1/          # REST API marshrutlari (auth, problems, solutions, solvers, admin, ai)
│   │   ├── admin/           # Boshqaruvchi (Admin Panel) sahifalari
│   │   ├── dashboard/       # Foydalanuvchi, Ekspert va Muhandis shaxsiy kabinetlari
│   │   ├── problems/        # Muammolar marketplace'i va batafsil ko'rish
│   │   └── solutions/       # Yechimlarni yuborish va ko'rish sahifalari
│   ├── components/          # Qayta ishlatiluvchi UI komponentlar
│   ├── context/             # React Context (AuthContext)
│   ├── lib/                 # Yordamchi tizim modullari (auth, prisma, api-response, utils)
│   ├── middleware.ts        # Himoyalangan yo'llar uchun Next.js global middleware
│   ├── services/            # Biznes-mantiq qatlami (Auth, Problem, Solution, Solver, Admin)
│   ├── types/               # Umumiy TypeScript tip tavsiflari
│   └── validators/          # Zod sxemalari (kiruvchi ma'lumotlarni qat'iy tekshirish)
└── tests/                   # Avtomatlashtirilgan integratsion va xavfsizlik testlari
```

---

## 💻 Lokal muhitda ishga tushirish

Lokal kompyuterda loyihani ishga tushirish uchun quyidagi ketma-ketlikni bajaring:

### 1. Talablar
- Node.js: `v18.17.0` yoki undan yuqori
- npm: `v9.0.0` yoki undan yuqori
- Git

### 2. Bog'liqliklarni o'rnatish
Loyiha ildiz papkasida terminalni oching va paketlarni o'rnating:
```bash
npm install
```

### 3. Atrof-muhit faylini yaratish
`.env.example` faylidan nusxa olib, `.env` faylini yarating:
```bash
# Windows PowerShell:
Copy-Item .env.example .env

# Linux / macOS:
cp .env.example .env
```

### 4. Ma'lumotlar bazasini tayyorlash
Prisma orqali SQLite sxemasini yuklang:
```bash
npx prisma generate
npx prisma db push
```

### 5. Boshlang'ich ma'lumotlarni (Seed) yuklash
Platforma to'g'ri ishlashi uchun kategoriyalar, rollar va namunaviy ma'lumotlarni bazaga kiriting:
```bash
npx tsx prisma/seed.ts
```

### 6. Loyihani ishlab chiqish rejimida ishga tushirish
```bash
npm run dev
```
Brauzer orqali oching: **`http://localhost:3000`**

---

## 🔑 Konfiguratsiya (.env fayli)

Loyiha uchun barcha konfiguratsiyalar `.env` faylida saqlanadi. Namuna (`.env.example`):

| O'zgaruvchi | Standart qiymat | Tavsif |
| :--- | :--- | :--- |
| `DATABASE_URL` | `"file:./dev.db"` | Lokal SQLite fayl yo'li (Productionda PostgreSQL manzili) |
| `JWT_SECRET` | *(Kuchli tasodifiy satr)* | JWT tokenlarni imzolash uchun maxfiy kalit (kamida 32 belgi) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Platformaning bazaviy URL manzili |
| `AI_SERVICE_API_KEY` | *(Opsional)* | AI yordamchi xizmatlari kaliti |
| `NODE_ENV` | `development` | Ishlash muhiti (`development` yoki `production`) |

> [!WARNING]
> Production muhitida `JWT_SECRET` parametri o'rnatilmagan bo'lsa yoki standart qiymatda qolsa, xavfsizlik tekshiruvchisi serverni qat'iy to'xtatadi. Hech qachon haqiqiy kalitlarni GitHub'ga yuklamang!

---

## 🛡 Zaxiralash va Qayta tiklash (Backup & Restore)

### Lokal SQLite ma'lumotlar bazasini zaxiralash
Lokal SQLite bazasi `prisma/dev.db` faylida joylashgan.

1. **Zaxira nusxa yaratish:**
   ```powershell
   # PowerShell orqali:
   $ts = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
   New-Item -ItemType Directory -Force -Path "_backups/backup_$ts"
   Copy-Item "prisma/dev.db" "_backups/backup_$ts/dev.db.bak"
   ```
2. **Qayta tiklash (Restore):**
   ```powershell
   # Oxirgi zaxira nusxasini tiklash:
   Copy-Item "_backups/backup_<SANA>/dev.db.bak" "prisma/dev.db" -Force
   ```

### PostgreSQL (Production) ma'lumotlar bazasini zaxiralash
Production serverda PostgreSQL uchun standart vositalardan foydalaniladi:
- **Backup olish:**
  ```bash
  pg_dump -U <foydalanuvchi> -h <host> -d <baza_nomi> -F c -b -v -f yechimuz_backup.dump
  ```
- **Qayta tiklash:**
  ```bash
  pg_restore -U <foydalanuvchi> -h <host> -d <baza_nomi> -v yechimuz_backup.dump
  ```

---

## ☁️ Production Deploy bo'yicha qo'llanma (Vercel + PostgreSQL)

Serverless hosting muhitida (masalan, Vercel) fayl tizimi vaqtinchalik (ephemeral) bo'lganligi sababli, SQLite bazasi ishlamaydi. Production uchun **PostgreSQL** tavsiya etiladi (masalan: Neon.tech, Supabase yoki AWS RDS).

### 1. PostgreSQL ma'lumotlar bazasini yaratish
1. [Neon.tech](https://neon.tech) yoki [Supabase](https://supabase.com) dan bepul PostgreSQL instansiyasini oching.
2. Ulanish satrini oling, masalan:
   `postgresql://user:password@ep-cool-db.us-east-1.aws.neon.tech/yechimuz?sslmode=require`

### 2. Prisma sxemasini PostgreSQL ga sozlash
`prisma/schema.prisma` faylida provayderni o'zgartiring:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Vercel'da Environment Variables sozlash
Vercel loyihasi boshqaruv panelida (Settings -> Environment Variables) quyidagilarni kiriting:
- `DATABASE_URL`: PostgreSQL ulanish manzili
- `JWT_SECRET`: Kuchli 64 belgili maxfiy kalit (masalan: `openssl rand -hex 32`)
- `NEXT_PUBLIC_APP_URL`: Domen manzili (masalan: `https://yechim.uz`)
- `NODE_ENV`: `production`

### 4. Vercel Build sozlamalari
- **Build Command:** `prisma generate && next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

Deploy tugagach, ma'lumotlar bazasi jadvallarini yuklash uchun lokal terminaldan buyruq bering:
```bash
npx prisma db push
```

---

## 🧪 Avtomatlashtirilgan testlar

Platformada barcha asosiy funksiyalar va xavfsizlik qoidalari avtomatlashtirilgan testlar orqali tekshirilgan. Testlarni quyidagi buyruqlar orqali ishga tushirishingiz mumkin:

| Test to'plami | Fayl | Sinovlar soni | Maqsadi |
| :--- | :--- | :---: | :--- |
| **Auth & RBAC** | `tests/phase1-auth.test.ts` | 17 ta | Ro'yxatdan o'tish, rollar, JWT va profil |
| **Muammolar & Filtr** | `tests/phase2-problems.test.ts` | 10 ta | Muammo yaratish, hududiy qidiruv va statuslar |
| **Yechimlar & Baholash** | `tests/phase3-solutions.test.ts` | 12 ta | Yechim yuborish, 9 mezonli ekspert baholash, shortlist |
| **Xavfsizlik & Ruxsatlar** | `tests/phase6-security.test.ts` | 6 ta | Ruxsatsiz status o'zgartirish va shortlist bloklanishi |

### Barcha testlarni ishga tushirish:
```bash
# 1. Autentifikatsiya testlari
npx tsx tests/phase1-auth.test.ts

# 2. Muammolar testlari
npx tsx tests/phase2-problems.test.ts

# 3. Yechimlar va ekspert baholash testlari
npx tsx tests/phase3-solutions.test.ts

# 4. Xavfsizlik va ruxsatlar testlari
npx tsx tests/phase6-security.test.ts

# 5. TypeScript tekshiruvi (0 errors)
npx tsc --noEmit

# 6. Production Build tekshiruvi
npm run build
```

---

## 🔒 Xavfsizlik va RBAC tizimi

Platformada quyidagi xavfsizlik mexanizmlari qat'iy joriy etilgan:

1. **Ruxsatsiz Status O'zgartirishdan Himoya:**
   - Muammo statusini faqat muammo egasi (`problem.ownerId === userId`) yoki vakolatli ma'murlar (`ADMIN`, `SUPER_ADMIN`, `MODERATOR`) o'zgartira oladi.
   - Begona foydalanuvchilar urinishlari servis qatlamida 403 xatolik bilan bloklanadi.
2. **Yechimlarni Shortlist Qilish Himoyasi:**
   - Yechimni shortlistga kiritish faqat tegishli muammo egasi, tayinlangan `EXPERT` yoki tizim `ADMIN`i tomonidan amalga oshirilishi mumkin.
3. **Production JWT Himoyasi:**
   - Maxfiy kalitsiz tizim production rejimida ishga tushmaydi.
4. **Xavfsiz JSON Parsing:**
   - SQLite matnli maydonlari `safeJsonParse()` orqali xavfsiz o'qiladi va server qulashining oldi olinadi.
5. **Audit Jurnali (Audit Logging):**
   - Barcha muhim amallar (muammo statusi, admin qarorlari) `AuditLog` jadvalida qayd etib boriladi.

---

## 👥 Foydalanuvchi rollari

- `USER` — Oddiy foydalanuvchi / fuqaro
- `SOLVER` — Muammo va challenge'larga yechim taklif qiluvchi muhandis / dasturchi
- `PROBLEM_OWNER` — Muammo e'lon qiluvchi shaxs yoki subyekt
- `COMPANY` — Korxona yoki sanoat tashkiloti
- `STARTUP` — Innovatsion startap jamoasi
- `EXPERT` — Yechimlarni 9 mezon asosida baholovchi mustaqil ekspert
- `SPONSOR` — Loyihalarni moliyalashtiruvchi homiy
- `MODERATOR` — Kontent sifatini tekshiruvchi
- `ADMIN` / `SUPER_ADMIN` — Platforma boshqaruvchilari

---

## 📄 Litsenziya

YechimUZ loyihasi mualliflik huquqi bilan himoyalangan. Barcha huquqlar saqlangan.
