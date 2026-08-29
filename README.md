# Peer Tutoring Booking Platform

A simple semester-ready web app for connecting tutors and tutees through session
requests, booking statuses, and tutor profiles. The project demonstrates a
list-to-detail experience, role-based users, a multi-step booking lifecycle, a
live activity counter, and a simple generative-text feature for study suggestions.

## Project Highlights
- **Core Entities**: `User`, `Session`, and `Booking`
- **Roles**: `tutor` and `tutee`
- **Booking Lifecycle**: `requested -> confirmed -> completed`
- **Live Feature**: automatic activity counter updates
- **Generative Text**: AI-style study tip generation

## Tech Stack
- React 19 · React Router 8 (SPA routing)
- TanStack Query (React Query) — data fetching + caching
- Zustand (with `persist`) — auth + UI state, saved to localStorage
- Vite (dev server + bundler) · Tailwind CSS
- json-server — mock REST API on port 3001, served from `db.json`
- React Hook Form + Zod (`@hookform/resolvers`) — form values + validation
- Shadcn UI (Base UI + Nova preset) — Button, Input and Label, owned in `src/components/ui/`

> The booking form's rules live in `src/schemas/bookingSchema.ts` (Zod), the
> form type is derived with `z.infer`, and the schema is wired into the form
> with `zodResolver`. Invalid submissions never reach the API.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

**Two servers must run at the same time** — keep both terminals open while you work.

### Terminal 1 — the API (json-server)
```bash
npm run api
# GET/POST http://localhost:3001/sessions  ,  /bookings
```

### Terminal 2 — the app (Vite + HMR)
```bash
npm run dev
# open http://localhost:3000
```

> Stopping the API makes the pages show a red "is json-server running on port
> 3001?" error. The app otherwise can't load any session/booking data.

## Build
```bash
npm run build      # must finish with ZERO TypeScript errors
```


