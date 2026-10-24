# Peer Tutoring Booking Platform

A simple semester-ready web app for connecting tutors and tutees through session
requests, booking statuses, and tutor profiles. The project demonstrates a
list-to-detail experience, role-based users, a multi-step booking lifecycle, a
live activity counter, and a simple generative-text feature for study suggestions.

## Project Highlights
- **Core Entities**: `User`, `Session`, and `Booking`
- **Roles**: `tutor` and `tutee`
- **Booking Lifecycle**: `requested -> confirmed -> completed`
- **Real accounts**: register and log in with email + password; the backend signs a JWT
- **Live Feature**: automatic activity counter updates
- **Generative Text**: AI-style study tip generation

## Tech Stack
- React 19 · React Router 8 (SPA routing)
- TanStack Query (React Query) — data fetching + caching
- Zustand (with `persist`) — auth + UI state, saved to localStorage
- Vite (dev server + bundler) · Tailwind CSS
- React Hook Form + Zod (`@hookform/resolvers`) — form values + validation
- Shadcn UI (Base UI + Nova preset) — Button, Input and Label, owned in `src/components/ui/`
- **API**: [itelect4-backend](https://github.com/haziaintsht/itelect4-backend) — Express + MongoDB + JWT.
  Every call to it lives in `src/api/client.ts`.

> The booking form's rules live in `src/schemas/bookingSchema.ts` (Zod), the
> form type is derived with `z.infer`, and the schema is wired into the form
> with `zodResolver`. Invalid submissions never reach the API.

## Installation

```bash
npm install
```

## Running the App

**Two servers must run at the same time** — keep both terminals open while you work.

### Terminal 1 — the API (itelect4-backend)
```bash
cd ../itelect4-backend
npm run dev
# API on http://localhost:4000
```

### Terminal 2 — the app (Vite + HMR)
```bash
npm run dev
# open http://localhost:3000
```

The app calls `http://localhost:4000` unless `VITE_API_URL` says otherwise
(copy `.env.example` to `.env` to change it). The backend's `CORS_ORIGIN` must be
`http://localhost:3000` for the browser to accept its replies.

## Build
```bash
npm run build      # must finish with ZERO TypeScript errors
```

## Deploy (Vercel)

Deploy the backend first — this app needs its address.

1. Push to GitHub. On vercel.com: **Add New → Project → Import** `itelect4-project`. Preset **Vite**.
2. Environment Variable: `VITE_API_URL` = `https://<backend>.vercel.app` (no trailing slash).
   Vite bakes it in at build time, so changing it later needs a redeploy.
3. Deploy, then copy this site's address into the **backend's** `CORS_ORIGIN` and redeploy the backend.

`vercel.json` sends every path to `index.html`, so refreshing `/bookings` or
`/sessions/:id` loads the app instead of a Vercel 404.
