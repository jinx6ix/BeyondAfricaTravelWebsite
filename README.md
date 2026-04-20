# 🌍 Savanna & Beyond — Full-Stack Travel Agency App

A production-ready **Next.js 14 + Supabase PostgreSQL** travel agency application with a public SEO-optimised website and a fully authenticated internal management dashboard.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL via Supabase |
| **ORM** | Prisma 5 |
| **Auth** | NextAuth v5 (Credentials — email/password) |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **Validation** | Zod |
| **Notifications** | react-hot-toast |
| **Fonts** | DM Sans + Cormorant Garamond |

---

## 🚀 Full Setup Guide

### Step 1 — Clone & Install

```bash
# Unzip the project
unzip savanna-beyond-fullstack.zip
cd savanna-beyond

# Install all dependencies
npm install
```

---

### Step 2 — Create Your Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)** and sign up (free)
2. Click **"New project"** → choose a name (e.g. `savanna-beyond`)
3. Set a strong database password and save it
4. Wait ~2 minutes for the project to provision

**Get your connection strings:**
- Go to **Project Settings → Database → Connection string**
- Copy the **URI** (Pooled / Transaction mode) → this is your `DATABASE_URL`
- Copy the **Direct connection URI** → this is your `DIRECT_URL`

Both strings look like:
```
postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

### Step 3 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# From Supabase → Project Settings → Database
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### Step 4 — Push Schema & Seed Database

```bash
# Push the Prisma schema to Supabase (creates all tables)
npx prisma db push

# Seed the database with demo data (tours, clients, bookings, staff, finances)
npm run db:seed
```

You should see output like:
```
✅ Admin user: admin@savannaandbeyond.co.ke
✅ 6 tours seeded
✅ 6 staff seeded
✅ 8 clients seeded
✅ 8 bookings seeded
✅ 12 finance entries seeded
✅ Reviews seeded
🌍 Database seeded successfully!
```

---

### Step 5 — Run Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Admin Login

Navigate to `http://localhost:3000/login`

| Field | Value |
|---|---|
| Email | `admin@savannaandbeyond.co.ke` |
| Password | `admin123` |

**Change this password immediately in production!**

To update it, run:
```bash
npx ts-node -e "
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
bcrypt.hash('your-new-password', 12).then(h => p.user.update({ where:{email:'admin@savannaandbeyond.co.ke'}, data:{password:h} })).then(console.log)
"
```

---

## 📁 Project Structure

```
savanna-beyond/
├── prisma/
│   ├── schema.prisma          # Full DB schema (11 models)
│   └── seed.ts                # Database seeder
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home (SSR, fetches featured tours)
│   │   ├── login/             # Login page
│   │   ├── tours/
│   │   │   ├── page.tsx       # Tours listing (client, live search)
│   │   │   └── [id]/          # Tour detail + booking form
│   │   ├── about/             # About (SSR, reads staff from DB)
│   │   ├── contact/           # Contact (posts enquiry to DB)
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Auth guard (server-side)
│   │   │   ├── page.tsx       # Dashboard (KPIs + charts)
│   │   │   ├── bookings/      # Full CRUD bookings
│   │   │   ├── clients/       # Client CRM
│   │   │   ├── staff/         # Staff management
│   │   │   ├── finances/      # P&L tracker + charts
│   │   │   ├── packages/      # Tour package management
│   │   │   └── reports/       # Analytics dashboard
│   │   └── api/
│   │       ├── auth/          # NextAuth handler
│   │       ├── tours/         # GET (public), POST/PATCH/DELETE (admin)
│   │       ├── bookings/      # Full CRUD (admin) + POST (public)
│   │       ├── clients/       # Full CRUD (admin)
│   │       ├── staff/         # Full CRUD (admin)
│   │       ├── finances/      # Full CRUD (admin)
│   │       ├── contact/       # POST enquiry (public), GET (admin)
│   │       └── stats/         # Dashboard KPIs + chart data
│   ├── components/
│   │   ├── layout/            # Navbar (server+client), Footer
│   │   ├── admin/             # Sidebar
│   │   └── ui/                # Badge, KpiCard, Avatar, Modal, Spinner...
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── auth.ts            # NextAuth config
│   │   └── api.ts             # Response helpers + auth check
│   ├── middleware.ts          # Route protection
│   └── types/
│       └── next-auth.d.ts     # Session type extensions
```

---

## 🌐 SEO Features

- `generateMetadata` on every page with title, description, keywords
- Open Graph + Twitter Card tags
- JSON-LD structured data (TravelAgency schema)
- Canonical URLs
- `next: { revalidate: 300 }` ISR on homepage tours
- Semantic HTML5 throughout
- Dynamic `sitemap.xml` (add `/app/sitemap.ts` to extend)

---

## 🛡 Security

- All `/admin` routes require authenticated session (server-side redirect)
- All `/api/bookings`, `/api/clients`, `/api/staff`, `/api/finances`, `/api/stats` protected by middleware
- Public routes: `GET /api/tours`, `POST /api/bookings` (public booking form), `POST /api/contact`
- Passwords hashed with bcrypt (12 rounds)
- Zod validation on all POST/PATCH endpoints
- NEXTAUTH_SECRET must be set in production

---

## ☁️ Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL
```

Or push to GitHub and connect to Vercel — it auto-deploys on every push.

**After deploy, update your env vars:**
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔧 Useful Commands

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run db:push       # Push schema changes to DB
npm run db:migrate    # Create migration files
npm run db:seed       # Re-seed the database
npm run db:studio     # Open Prisma Studio (visual DB browser)
npx prisma generate   # Regenerate Prisma client
```

---

## 🎨 Customisation

| What | Where |
|---|---|
| Business name | `src/app/layout.tsx`, `src/components/layout/Navbar.tsx` |
| Brand colours | `tailwind.config.ts` (forest & gold scales) |
| Admin password | See password update command above |
| Tour data | `prisma/seed.ts` or Admin → Tour Packages |
| Contact details | `src/app/contact/page.tsx` |
| Homepage testimonials | `src/app/page.tsx` (static array, or extend with DB) |

---

## 🔗 Extending the App

- **Stripe payments** → add `stripe` package, create `/api/payments/checkout` route, call from booking form
- **Email notifications** → add `resend` or `nodemailer`, trigger on new booking in `/api/bookings`
- **Image uploads** → add Supabase Storage or Cloudinary for tour photos
- **Multi-user admin** → the `User` model already has `role: ADMIN | STAFF | MANAGER`
- **Sitemap** → add `src/app/sitemap.ts` returning all tour URLs for Google indexing

---

Built with ❤️ in Nairobi 🌍
