# RiddlesMaster

A technical puzzle and brain teaser platform for engineering interview preparation. RiddlesMaster provides a curated library of logic riddles, lateral thinking problems, and estimation challenges used in real engineering interviews at top technology companies.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

RiddlesMaster targets a gap in existing interview preparation tools. While platforms like LeetCode focus on data structures and algorithms, RiddlesMaster focuses on the logical reasoning, lateral thinking, and estimation-style questions that are increasingly featured in engineering interviews at top-tier companies.

**Target audience:** Students, job seekers, and professionals preparing for technical interviews.

**Business model:** Freemium — a free tier with daily question limits and premium subscription plans with full access.

---

## Features

### Problem Library

- Curated collection of technical puzzles, brain teasers, and estimation problems.
- Each problem is tagged by company (e.g. Google, Amazon, Microsoft) and type (e.g. Logic, Math, Lateral Thinking).
- Difficulty levels: Easy, Medium, Hard.
- SEO-optimised individual problem pages at `/problems/[id]-[slug]`.
- Full-text search and multi-filter browsing by company, type, and difficulty.
- Rich-text problem statements and step-by-step editorial solutions.

### User Roles and Access

| Role | Access |
|---|---|
| Guest | Browse problems, view problem statements, 1 daily streak question |
| Free User | Submit answers, view hints, daily streak tracking, liked/bookmarked lists |
| Premium User | Unlimited daily questions, all editorials, premium problems, company-wise sets |
| Admin | Full CRUD on problems, editorials, and tags; user activity visibility |

### Authentication

- Google OAuth 2.0 (primary social login).
- Email and password registration with forgot password flow.
- Temporary email blocking — only Gmail, Yahoo, and Outlook domains are accepted.
- Admin access is restricted to a secret, unlisted URL not exposed in any UI navigation.

### Daily Streak System

- One random riddle is served daily to all users, including guests.
- Logged-in users accumulate a daily streak for consecutive days of activity.
- User profiles display a Git-style activity heatmap, current streak, and maximum streak.
- Streak resets at midnight IST if a day is skipped.

### User Profile

- Statistics: total problems solved and attempted.
- Activity heatmap (GitHub contribution graph style).
- Personal liked and bookmarked problem lists.
- Streak history: current streak, maximum streak, active day count.

### Subscription and Payments

- Freemium model: 5 questions per day on the free tier.
- Premium plans: 1 month, 3 months, and 6 months.
- Payment processing via Razorpay (India).
- Subscription management with upgrade and cancellation support.

### Admin Panel

- Accessible only via a secret URL — not linked from any public-facing page.
- Full CRUD operations for problems, editorials, and taxonomy tags.
- User management and activity visibility.

### SEO

- Server-side rendered problem pages for full search engine indexing.
- Unique, descriptive URLs for every problem: `/problems/[id]-[slug]`.
- Per-page meta tags: `title`, `description`, `og:image`.
- Auto-generated `sitemap.xml` from all problem slugs.
- Configured `robots.txt` to allow indexing of problem pages.
- Structured data (JSON-LD) for rich search result snippets.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro](https://astro.build/) v6+ |
| UI Components | React 19 (Astro Islands) |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui + Radix UI |
| Rich Text Editor | Tiptap |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Auth | Supabase Auth (Google OAuth + Email/Password) |
| Payments | Razorpay |
| Email | Resend |
| Deployment | Vercel (SSR adapter) |
| Analytics | Vercel Analytics + Speed Insights |
| Runtime | Node.js ≥ 22.12.0 |

---

## Architecture

RiddlesMaster is built as a server-side rendered (SSR) Astro application deployed on Vercel.

```
Browser
  |
  v
Vercel Edge Network
  |
  v
Astro SSR (output: 'server')
  |
  +-- Static .astro pages (SSR, SEO-optimised)
  |
  +-- React Islands (client-side interactivity)
  |     - Navbar.tsx
  |     - LikeButton.tsx
  |     - SolveButton.tsx
  |     - UpgradeButton.tsx
  |
  +-- API Routes (/api/*)
        |
        +-- Supabase (Auth, RLS-protected data)
        +-- Prisma ORM (PostgreSQL queries)
        +-- Razorpay (payment verification)
        +-- Resend (transactional email)
```

### Key Design Decisions

- **SSR by default.** All problem pages are server-rendered to maximise SEO and Core Web Vitals scores.
- **Islands architecture.** Interactive components (like/bookmark buttons, navbar state) are React islands hydrated on the client. The majority of the page remains static HTML.
- **Prisma over raw SQL.** Database access uses Prisma with the `@prisma/adapter-pg` serverless adapter, enabling type-safe queries on Vercel's edge runtime.
- **Supabase Auth + RLS.** Row Level Security is enforced on every table. Auth state is propagated server-side via `@supabase/ssr` for secure SSR rendering.
- **Prefetch on hover.** Astro's built-in prefetch is enabled globally with a `hover` strategy to improve perceived navigation speed.

---

## Project Structure

```
/
├── public/                     # Static assets (favicon, images)
├── prisma/
│   └── schema.prisma           # Prisma schema definition
├── supabase/
│   └── SCHEMA.sql              # Supabase table definitions and RLS policies
├── src/
│   ├── assets/                 # Optimised images and SVGs
│   ├── components/             # Shared UI components
│   │   ├── Hero.astro
│   │   ├── Navbar.astro / Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProblemCard.astro
│   │   ├── Pricing.astro
│   │   ├── LikeButton.tsx      # React island
│   │   ├── SolveButton.tsx     # React island
│   │   ├── UpgradeButton.tsx   # React island
│   │   ├── admin/              # Admin panel components
│   │   ├── practice/           # Practice mode components
│   │   └── ui/                 # shadcn/ui base components
│   ├── content/                # Astro content collections
│   ├── layouts/
│   │   └── Layout.astro        # Root layout with SEO meta tags
│   ├── lib/
│   │   ├── supabase.ts         # Shared Supabase client
│   │   ├── db.ts               # Prisma client instance
│   │   ├── daily.ts            # Daily streak logic
│   │   ├── problems.ts         # Problem query helpers
│   │   ├── currency.ts         # Currency / pricing utilities
│   │   └── utils.ts            # General utility functions
│   ├── pages/
│   │   ├── index.astro         # Landing page
│   │   ├── problems/
│   │   │   ├── index.astro     # Problem listing with filters
│   │   │   └── [slug].astro    # Individual problem page (SSR)
│   │   ├── profile.astro       # User profile and activity
│   │   ├── daily.astro         # Daily challenge page
│   │   ├── pricing.astro       # Subscription plans
│   │   ├── login.astro         # Login page
│   │   ├── signup.astro        # Registration page
│   │   ├── admin/              # Admin panel (secret URL)
│   │   ├── api/
│   │   │   ├── problems/       # Problem CRUD endpoints
│   │   │   ├── profile/        # Profile data endpoints
│   │   │   ├── streak/         # Streak tracking endpoints
│   │   │   ├── payment/        # Razorpay order and verify
│   │   │   ├── practice/       # Practice mode endpoints
│   │   │   └── daily.ts        # Daily riddle endpoint
│   │   ├── sitemap.xml.ts      # Dynamic sitemap generation
│   │   └── robots.txt.ts       # robots.txt generation
│   ├── styles/
│   │   └── global.css          # Global styles and Tailwind imports
│   ├── types/                  # Shared TypeScript type definitions
│   └── middleware.ts           # Auth middleware (session validation)
├── astro.config.mjs            # Astro configuration
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 22.12.0
- A [Supabase](https://supabase.com/) project
- A [Razorpay](https://razorpay.com/) account (for payment features)
- A [Resend](https://resend.com/) account (for transactional email)

### Installation

```bash
# Clone the repository
git clone https://github.com/gagan-1307/Riddles-Master.git
cd Riddles-Master

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will start at `http://localhost:4321`.

### Available Commands

| Command | Action |
|---|---|
| `npm run dev` | Start local development server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run Astro CLI commands |

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Prisma / PostgreSQL)
DATABASE_URL=your_postgres_connection_string

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Application
PUBLIC_SITE_URL=http://localhost:4321
```

---

## Database Schema

The database is managed via Prisma and hosted on Supabase (PostgreSQL). Row Level Security (RLS) is enforced on every table.

### Core Tables

| Table | Description |
|---|---|
| `users` | User profiles linked to Supabase Auth |
| `problems` | Problem library with rich-text content and tags |
| `submissions` | User attempt and solve records |
| `streaks` | Daily streak and activity tracking per user |
| `bookmarks` | User-saved problem bookmarks |
| `likes` | User problem likes |
| `subscriptions` | Premium subscription records and plan metadata |
| `tags` | Company and type taxonomy tags |

The full schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma) and [`supabase/SCHEMA.sql`](supabase/SCHEMA.sql).

### Problem Schema

| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Auto-incremented, used in URL |
| `slug` | String | URL-safe problem identifier |
| `title` | String | Short, descriptive title |
| `statement` | Rich Text | Full problem description |
| `answer` | Text | Short answer or hint |
| `editorial` | Rich Text | Step-by-step solution (premium) |
| `difficulty` | Enum | `EASY`, `MEDIUM`, `HARD` |
| `is_premium` | Boolean | Locks content behind paywall |
| `company_tags` | Array | e.g. Google, Amazon, Microsoft |
| `type_tags` | Array | e.g. Logic, Math, Estimation |
| `created_at` | Timestamp | Creation date |
| `updated_at` | Timestamp | Last modified date |

---

## API Reference

All API routes are located under `src/pages/api/`.

| Route | Method | Description |
|---|---|---|
| `/api/problems` | GET | List problems with optional filters |
| `/api/problems/[id]` | GET, PUT, DELETE | Get, update, or delete a problem |
| `/api/daily` | GET | Fetch today's daily riddle |
| `/api/streak` | GET, POST | Get or update user streak |
| `/api/profile` | GET, PUT | Get or update user profile data |
| `/api/stats` | GET | Aggregate user statistics |
| `/api/payment/order` | POST | Create a Razorpay payment order |
| `/api/payment/verify` | POST | Verify payment signature and activate subscription |
| `/api/health` | GET | Health check endpoint |

Authentication is enforced at the middleware level (`src/middleware.ts`) for all protected routes.

---

## Deployment

RiddlesMaster is deployed on [Vercel](https://vercel.com/) using the `@astrojs/vercel` SSR adapter.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Alternatively, connect the GitHub repository to a Vercel project for automatic deployments on every push to the main branch.

Ensure all environment variables from the [Environment Variables](#environment-variables) section are configured in the Vercel project settings.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Gagandeep Singh
```
