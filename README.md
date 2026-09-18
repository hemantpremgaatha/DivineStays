# DivineStays
Kota-first student accommodation website and lead-generation engine.

## Four launch properties
- Divine Residency — F-16 Jhawar Nagar — near Allen Sakar & Career Will
- Divine Residency — C-56 Landmark City, Kunadi — near Allen Samyak
- Divine Home — D-8 Landmark City, Kunadi — near Allen Sangyan
- Divine Home — G-62 Coral Park — near Allen Supath

## Stack
Next.js (App Router) + Prisma/Postgres (Supabase) + Supabase Storage. Deploys to Vercel — this app uses server-side rendering, API routes and middleware, so it is **not** compatible with static hosting (GitHub Pages).

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in a Supabase project's connection strings/keys, an `ADMIN_PASSWORD`, a `SESSION_SECRET`, your real WhatsApp/call numbers, and SMTP details for lead-notification emails (see comments in `.env.example` — Gmail App Password works).
3. `npm run db:migrate` then `npm run db:seed`
4. `npm run dev`

## Admin
`/admin` (password-protected via `ADMIN_PASSWORD`):
- **Overview** — lead funnel (new/contacted/qualified/converted/lost), today's leads, conversion rate, booking count.
- **Leads** — table with status pipeline, "Create booking" to convert a lead directly.
- **Bookings** — list + status updates (requested/confirmed/checked-in/cancelled/completed), "New booking" form.
- **Properties** — edit core details, manage offers and FAQs per property. Photo uploads still need a photo-management UI (placeholders in use).
- **Reviews** — approve/reject moderation queue.

## Deploying
This app needs SSR/API routes/a database, so it deploys to **Vercel**, not GitHub Pages:
1. Create a free Supabase project → copy `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` into Vercel's env vars.
2. Set `ADMIN_PASSWORD`, `SESSION_SECRET` (64-char hex), `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CALL_NUMBER`, and the `SMTP_*`/`ADMIN_NOTIFY_EMAIL` vars.
3. Import this GitHub repo into Vercel — it auto-detects Next.js.
4. Run `npx prisma migrate deploy` against the Supabase database (once, from your machine or a Vercel deploy hook), then `npm run db:seed` if it's a fresh database.

## Status
Live: JustDial-style directory homepage with area filter, per-property detail pages (photos, map, offers, FAQs, reviews), click-to-call/WhatsApp on every listing, lead capture wired to the DB with email notification on every new lead, public review submission with admin moderation, a lead-to-booking conversion flow, a conversion-funnel dashboard, and admin CRUD for properties/offers/FAQs.

Not built yet: a photo-upload UI (Supabase Storage is wired for it, but photos are still edited via Prisma Studio / seed data), property comparison view, live deployment (needs a Supabase project + Vercel import — see Deploying above).