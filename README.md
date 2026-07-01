# LearnEarn 360

**Learn Skills. Build Connections. Earn Money.**

An all-in-one platform combining learning, community, accountability, and earning opportunities. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Stripe.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Auth | NextAuth v5 |
| Payments | Stripe |
| Email | Resend |
| File Uploads | UploadThing |
| Real-time | Socket.io |
| State | Zustand + React Query |
| Charts | Recharts |

---

## Quick Start (Local Dev)

### 1. Clone and install

```bash
git clone https://github.com/yourorg/learnearn360.git
cd learnearn360
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`. Required at minimum:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-at-least-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start PostgreSQL (Docker)

```bash
docker run -d \
  --name learnearn-db \
  -e POSTGRES_USER=learnearn \
  -e POSTGRES_PASSWORD=learnearn_password \
  -e POSTGRES_DB=learnearn360 \
  -p 5432:5432 \
  postgres:16-alpine
```

Or update `DATABASE_URL` to point to any existing Postgres instance.

### 4. Run database migrations and seed

```bash
npm run db:migrate
npm run db:seed
```

This creates all tables and seeds:
- 14 badge types
- 5 demo users (including admin)
- 18 rooms across all 8 hubs
- 6 courses with lessons
- Sample posts

**Demo login credentials (password: `Password123`):**

| Email | Role |
|---|---|
| admin@learnearn360.com | ADMIN |
| aisha@example.com | User |
| marcus@example.com | User |
| priya@example.com | User |
| diego@example.com | User |

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
learnearn360/
├── app/
│   ├── (auth)/              # Login, register, reset-password
│   ├── (dashboard)/         # All protected app pages
│   │   ├── dashboard/       # Home feed
│   │   ├── rooms/           # Room list + [slug] detail
│   │   ├── library/         # Courses + [slug] course player
│   │   ├── profile/         # [username] public profile
│   │   ├── leaderboard/     # XP rankings
│   │   ├── notifications/   # Notification center
│   │   ├── settings/        # Profile + billing
│   │   └── admin/           # Admin dashboard
│   ├── api/                 # All API routes
│   └── (static)/            # Landing, about, terms, privacy
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # Sidebar, TopBar
│   ├── landing/             # Landing page sections
│   ├── auth/                # Login, register forms
│   ├── posts/               # PostCard, CreatePostModal
│   ├── courses/             # LibraryClient, CourseDetailClient
│   ├── rooms/               # RoomsClient, RoomDetailClient
│   ├── gamification/        # XpCard, DailyGoals, Leaderboard
│   ├── profile/             # ProfileClient
│   ├── notifications/       # NotificationsClient
│   ├── settings/            # SettingsClient, BillingClient
│   ├── admin/               # AdminOverview, AdminUsers, etc.
│   └── shared/              # ThemeProvider, QueryProvider, etc.
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Prisma client singleton
│   ├── gamification.ts      # XP engine, badge checker, streak logic
│   ├── stripe.ts            # Stripe client + plan config
│   ├── resend.ts            # Email helpers
│   └── utils.ts             # Shared utilities, constants
├── hooks/                   # React hooks (useSocket, useNotifications)
├── store/                   # Zustand stores
├── types/                   # TypeScript types
├── server/                  # Socket.io server
├── emails/                  # React Email templates
├── prisma/
│   ├── schema.prisma        # Full DB schema
│   └── seed.ts              # Seed data
├── Dockerfile
├── Dockerfile.socket
├── docker-compose.yml
└── .env.example
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | NextAuth secret (32+ chars) |
| `AUTH_URL` | ✅ | App base URL |
| `AUTH_GOOGLE_ID` | OAuth | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | OAuth | Google OAuth Client Secret |
| `STRIPE_SECRET_KEY` | Payments | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Payments | Stripe webhook secret |
| `STRIPE_PREMIUM_MONTHLY_PRICE_ID` | Payments | Stripe price ID |
| `STRIPE_PREMIUM_ANNUAL_PRICE_ID` | Payments | Stripe price ID |
| `STRIPE_LIFETIME_PRICE_ID` | Payments | Stripe price ID |
| `RESEND_API_KEY` | Email | Resend API key |
| `EMAIL_FROM` | Email | Sender address |
| `UPLOADTHING_SECRET` | Uploads | UploadThing secret |
| `UPLOADTHING_APP_ID` | Uploads | UploadThing app ID |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payments | Stripe publishable key |
| `NEXT_PUBLIC_SOCKET_URL` | Real-time | Socket.io server URL |

---

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create three products:
   - **Premium Monthly** → $19/month recurring
   - **Premium Annual** → $149/year recurring
   - **Lifetime** → $399 one-time
3. Copy the Price IDs into `.env`
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Add these events to the webhook:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

---

## Deployment

### Option 1: Vercel (Recommended for Next.js)

```bash
npm i -g vercel
vercel
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

For the database, use [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tiers available).

After deploying, run migrations:
```bash
# Set DATABASE_URL then:
npx prisma migrate deploy
npm run db:seed
```

### Option 2: Railway

1. Create a project at [railway.app](https://railway.app)
2. Add a **PostgreSQL** plugin — Railway auto-sets `DATABASE_URL`
3. Add a **Redis** plugin (optional, for caching)
4. Connect your GitHub repo
5. Set all env vars in Railway dashboard
6. Railway auto-detects Next.js and deploys on push

Add to `railway.toml` (auto-generated by Railway) or set the start command:
```
npx prisma migrate deploy && node server.js
```

### Option 3: Render

1. Create a **Web Service** at [render.com](https://render.com)
2. Set **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
3. Set **Start Command**: `npm start`
4. Add a **PostgreSQL** database service
5. Set all env vars in Render dashboard

### Option 4: Docker Compose (Self-hosted / VPS)

```bash
# Copy and fill in your env file
cp .env.example .env
nano .env

# Build and start everything
docker compose up -d --build

# Run migrations inside the web container
docker compose exec web npx prisma migrate deploy
docker compose exec web npm run db:seed
```

The stack runs on:
- **:3000** → Next.js web app
- **:3001** → Socket.io real-time server
- **:5432** → PostgreSQL
- **:6379** → Redis

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run db:push      # Push schema without migration (dev only)
npm run db:migrate   # Create + apply migration
npm run db:migrate:prod  # Apply migrations in production
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (GUI)
```

---

## Adding a Google OAuth App

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Google+ API**
3. Go to **Credentials** → **Create OAuth 2.0 Client ID**
4. Set Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret into `.env`

---

## Feature Roadmap

- [x] Authentication (email + Google OAuth)
- [x] Community rooms with posts, comments, reactions
- [x] 8 specialized hub categories
- [x] Course system with video player + progress tracking
- [x] XP, levels, streaks, badges, leaderboard
- [x] Daily goals and accountability tools
- [x] Stripe subscriptions (monthly, annual, lifetime)
- [x] Admin dashboard with analytics
- [x] Real-time notifications (Socket.io)
- [x] File uploads (UploadThing)
- [x] Dark/light mode
- [x] Mobile-responsive design
- [ ] Mobile app (React Native / Expo)
- [ ] Live video rooms
- [ ] Mentorship marketplace
- [ ] Digital products marketplace
- [ ] AI resume review (OpenAI integration)
- [ ] Cohort-based courses

---

## License

MIT — see LICENSE file.

---

Built with ❤️ by LearnEarn 360 Team
