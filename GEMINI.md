# RiddlesMaster

Project guidance for RiddlesMaster, a technical puzzle and brain teaser platform for engineering interview preparation.

## Tech Stack

- **Frontend:** [Astro](https://astro.build/) (v6+) with TypeScript.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha).
- **Backend/Database:** [Supabase](https://supabase.com/) (Auth, Postgres, Edge Functions).
- **Design System:** Claude-inspired design language (see `DESIGN.md`).

## Core Conventions

### Architecture & Framework
- **SSR by Default:** Most pages should be Server-Side Rendered (SSR) to support SEO requirements, especially problem pages (`/problems/[id]-[slug]`).
- **Component Strategy:** 
  - Use `.astro` components for static and server-rendered UI.
  - Use Framework components (React/Svelte/Vue) ONLY when complex client-side state is required (islands architecture).
- **Styling:** Strictly follow Tailwind CSS 4 conventions. Avoid custom CSS unless absolutely necessary (defined in `src/styles/global.css`). Refer to `DESIGN.md` for specific color tokens and typography scales.

### Supabase & Data
- **Client Access:** Use the shared client in `src/lib/supabase.ts`.
- **Schema Management:** Keep `supabase/SCHEMA.sql` updated with the latest table definitions and RLS policies.
- **Security (RLS):** Every table MUST have Row Level Security (RLS) enabled. Use `TO authenticated` or `TO anon` for policy targeting. Never use `auth.role()` for authorization.
- **Auth:** Support Google OAuth and Email/Password. Whitelist official email providers (Gmail, Yahoo, Outlook).

### Content & SEO
- **URL Structure:** Problems must follow `/problems/[id]-[slug]` for SEO optimization.
- **Metadata:** Use `<Layout>` component in `src/layouts/Layout.astro` to manage per-page SEO meta tags.

## Design System Highlights (Claude-inspired)

- **Colors:** Warm cream canvas (`#faf9f5`) with coral accents (`#cc785c`) and dark navy product surfaces (`#181715`).
- **Typography:** Serif display (Copernicus/Tiempos) for headlines, humanist sans (StyreneB/Inter) for body.
- **Elevation:** Color-block first, shadows are rare. 1px hairline borders (`#e6dfd8`) for definition.
- **Buttons:** 8px rounded corners for CTAs; signature coral background for primary actions.
- **Atmosphere:** Editorial and literary pacing with generous whitespace (`96px` section spacing).

## Workflow

1. **Research:** Check `DESIGN.md` for UI tokens and `Interview Riddle Platform.txt` (PRD) for feature requirements.
2. **Schema Changes:** Modify the database via Supabase Dashboard/CLI and sync changes back to `supabase/SCHEMA.sql`.
3. **UI Development:** Create components in `src/components` using Tailwind 4.
4. **Validation:** Ensure SSR pages are performant and SEO-friendly.

## Project Memory
- **Admin Access:** Secret URL (not exposed in UI).
- **Daily Streak:** Hard reset at midnight IST.
- **Freemium Limits:** 5 questions/day for free users.
