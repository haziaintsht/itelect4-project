# 🎓 MA1 Soft Reviewer — Sessions 1–8

**Repo:** `itelect4-project` — Peer Tutoring Booking Platform
**Defense:** 1-on-1 online · present Sessions 1–8 · 5 minutes of questions from YOUR repo
**Scored 4 × 25:** ① the app runs and builds ② you can find your own code ③ you can explain **why** it works ④ you answer clearly

> **How to use this:** every answer below points at a real file in this repo. Practice
> opening each file in ≤5 seconds — "finding your own code" is 25 points by itself.

---

## 🗺️ The map — where everything lives

```
itelect4-project/
├── sample.ts                  ← S1 practice file (kept on purpose)
├── src/
│   ├── index.ts               ← S1/S2 playground: generics, ReturnType
│   ├── types/index.ts         ← THE FOUNDATION (S1): enums + 3 interfaces
│   ├── data/mockData.ts       ← users array (S7: sessions/bookings moved OUT)
│   ├── hooks/useToggle.ts     ← S4 custom hook
│   ├── hooks/usePrevious.ts   ← S4 useRef + useEffect
│   ├── components/
│   │   ├── Usercard.tsx       ← S3 props
│   │   ├── ComplaintCard.tsx  ← S3 props + S5 variant + dark mode
│   │   ├── StatusBadge.tsx    ← S3 children
│   │   ├── Layout.tsx         ← S6 Outlet + S5 dark class + S7 stores
│   │   ├── ProtectedRoute.tsx ← S6 gate
│   │   └── ui/                ← S8 shadcn (button/input/label — OWNED)
│   ├── pages/                 ← S6 routes (Dashboard, Sessions, SessionDetail,
│   │                             Bookings, Login, NotFound)
│   ├── store/authStore.ts     ← S7 Zustand + persist
│   ├── store/uiStore.ts       ← S7 Zustand (dark mode, search)
│   ├── api/client.ts          ← S7 every fetch in one file
│   ├── schemas/bookingSchema.ts ← S8 Zod rules + z.infer
│   └── lib/utils.ts           ← S8 cn() helper
```

---

## 📘 Session 1 — Types, interfaces, enums

**Where:** `src/types/index.ts` (+ `sample.ts`, `src/index.ts` playgrounds)

**What you built:** the 3 core entities the WHOLE app still runs on — unchanged since day 1.

- **3 enums:** `UserRole` (tutor/tutee) · `BookingStatus` (requested/confirmed/completed) · `SessionType` (one-on-one/group). *Why:* one source of truth for string values — a typo like `"confrimed"` becomes a compile error instead of a silent bug.
- **3 interfaces:** `User`, `Session`, `Booking`.
- **Utility types:** `SessionUpdate = Partial<Session>` · `PublicTutorView = Omit<User, "email">` · `StatusCounts = Record<BookingStatus, number>`.

**Likely questions**
- *"Why enums instead of plain strings?"* → One place to define values; TS rejects typos at compile time; autocomplete everywhere.
- *"Where are your interfaces?"* → `src/types/index.ts`, lines with `// ===== INTERFACES =====`.
- *"What is `Partial<Session>`?"* → A mapped type making every field optional — used for update payloads.
- *"What is `Record<BookingStatus, number>`?"* → An object whose keys MUST be the 3 enum values and whose values are numbers — a counted tally per status.

---

## 📗 Session 2 — Generics & `typeof`

**Where:** `src/types/index.ts` (`ApiResponse<T>`) · `src/index.ts` (`getById`, `ReturnType`)

- `interface ApiResponse<T> { success: boolean; data: T; message?: string }` — write the wrapper once, reuse for any payload.
- `getById<T extends { id: number }>(items: T[], id: number)` — a generic with a **constraint**: T must at least have `id: number`.
- `type SessionNote = ReturnType<typeof generateSessionNote>` — the type-level `typeof` reads a VALUE and hands back its type.

**Likely questions**
- *"What does `extends { id: number }` do in your generic?"* → Constrains T: you can only call `getById` with arrays of things that have a numeric id.
- *"Where do you use a generic in the finished app?"* → `ApiResponse<T>` in `types/index.ts`, `usePrevious<T>` in `hooks/usePrevious.ts`, `useForm<BookingFormValues>` in Session 8, `useQuery<ApiSession[]>` in Session 7.
- *"Compile time vs runtime?"* → TS exists only at compile time and is erased before runtime — that's why Zod (runtime) exists alongside interfaces (compile time).

## 📙 Session 3 — Components & props

**Where:** `src/components/Usercard.tsx`, `ComplaintCard.tsx`, `StatusBadge.tsx`

- Every component has a **props interface** (`UserCardProps`, `ComplaintCardProps`, `StatusBadgeProps`) — props are typed, not `any`.
- `ComplaintCard` takes `variant?: "default" | "compact"` — one component, two looks, chosen with a ternary. (Session 8's `cva` in shadcn is this same idea, scaled up.)
- `StatusBadge` uses `children?: React.ReactNode` — that's why bookings can nest the date inside the badge.
- Props flow **down**; events flow **up** via callbacks like `onSelect: (user: User) => void`.

**Likely questions**
- *"Why is `variant` optional?"* → It has a default (`= "default"`), so callers only pass it when they want the other look.
- *"What type is `children` and why?"* → `React.ReactNode` — accepts text, elements, or nothing.
- *"Is `onSelect` required?"* → Yes in the interface — but pages that don't need it pass a no-op `() => {}` (see `SessionsPage`).

---

## 📓 Session 4 — State & custom hooks

**Where:** `src/hooks/useToggle.ts`, `src/hooks/usePrevious.ts`, `src/pages/DashboardPage.tsx`

- `useToggle(initial): [boolean, () => void]` — returns a **tuple**, destructured like `useState`. Uses `setValue(prev => !prev)` because the new value depends on the old one.
- `usePrevious<T>(value: T): T | undefined` — `useRef` survives re-renders; `useEffect` writes the current value AFTER render, so the ref always holds the **previous** one. Used by `SessionsPage` to show "Previous search".
- `DashboardPage` uses `useState` + `useEffect` with `setInterval` (the live counter ticks every 4s) — and cleans up with `clearInterval` in the return.
- **Destructuring** (`const [a, b] = ...`, `const { data } = ...`) returns in Session 8 as `formState: { errors }`.

**Likely questions**
- *"Why does `usePrevious` return the OLD value?"* → Effects run after render, so the ref is updated after the UI painted — returning `ref.current` gives the value from before this render.
- *"Why `setValue(prev => !prev)` instead of `setValue(!value)`?"* → The functional form is safe against stale closures/batched updates.
- *"What cleans up your interval?"* → The effect's return function calls `clearInterval` — prevents a memory leak when DashboardPage unmounts.

---

## 📙 Session 5 — Tailwind, dark mode, variants

**Where:** `src/index.css` · `src/store/uiStore.ts` · `src/components/Layout.tsx` · `ComplaintCard.tsx`

- `index.css` starts with `@import "tailwindcss";` and the custom variant: `@custom-variant dark (&:where(.dark, .dark *));` — this is what makes `dark:` classes respond to a wrapper class instead of the OS setting.
- Dark mode = **one `.dark` class on a wrapper div** in `Layout.tsx` (`className={isDarkMode ? "dark" : ""}`), driven by `uiStore.isDarkMode`.
- Every dark style is a **pair**: `text-slate-900 dark:text-slate-100`. (Session 8 adds the shadcn way: `text-foreground` — one class, both themes, because the CSS variable changes under `.dark`.)
- Tailwind scans for **complete literal class strings** — that's why `variant` values are written out in full, never concatenated.

**Likely questions**
- *"How does your dark mode work with no darkMode config?"* → Tailwind v4: the `@custom-variant dark` line redefines `dark:` to match a `.dark` ancestor; the toggle just adds/removes that class.
- *"Where does the class live and who flips it?"* → On the wrapper `div` in `Layout.tsx`; `toggleDarkMode` from `uiStore` flips the boolean (persisted).

---

## 📕 Session 6 — Routing

**Where:** `src/App.tsx` · `components/Layout.tsx` · `components/ProtectedRoute.tsx` · `pages/*`

- `App.tsx` is the **route table only**: one parent `<Route path="/" element={<Layout />}>`, `index` → Dashboard, `sessions`, `sessions/:sessionId`, `login`, protected `bookings`, and `*` → NotFound.
- `Layout.tsx` renders `<Outlet />` — "the hole" where matched child pages render. Nav uses `NavLink` with an `isActive` callback.
- `ProtectedRoute` reads `token` from `authStore`; if `null` → `<Navigate to="/login" replace />`, else `<Outlet />`.
- `SessionDetailPage` reads `useParams<{ sessionId: string }>()` and moves with `useNavigate()`.
- `Login` calls `login(name)` from the store, then `navigate("/bookings")`.

**Likely questions**
- *"Walk me through what happens when a logged-out user opens /bookings."* → Route matches inside `<ProtectedRoute>` → token is null → `<Navigate to="/login" replace>` → after login, `navigate("/bookings")` succeeds because the token is now in the store (persisted, so it survives refresh).
- *"What does `replace` do in `<Navigate>`?"* → Replaces the history entry instead of pushing, so Back doesn't return to the blocked page.
- *"Why is `sessions/:sessionId` a dynamic segment?"* → One route definition serves every session; `useParams` pulls the id, and it goes INTO the queryKey so each detail page gets its own cache entry.

## 📒 Session 7 — Real data: json-server, TanStack Query, Zustand

**Where:** `src/api/client.ts` · `src/store/authStore.ts` · `src/store/uiStore.ts` · `src/main.tsx` · pages

- **`client.ts` owns every fetch** — `fetchSessions`, `fetchSessionById`, `fetchBookings`, `createBooking`, all typed, all pointing at `API_URL` (`http://localhost:3001`). No component calls `fetch` directly — when the backend moves (Module 4), only `API_URL` changes.
- **Two terminals:** `npm run api` (json-server on 3001) + `npm run dev` (Vite on 3000).
- **useQuery** — `queryKey` is the cache address. `["sessions"]` is shared by `SessionsPage`, `DashboardPage` (count) and `BookingsPage` (titles); `["bookings"]` is shared by `BookingsPage` and `SessionDetailPage`. One request serves many components.
- **useMutation** — `BookingsPage` POSTs via `createBooking`; `onSuccess` calls `queryClient.invalidateQueries({ queryKey: ["bookings"] })` → the mounted query refetches → the new card appears **with no reload**.
- **Query keys with params:** `["sessions", sessionId]` in the detail page — a different key per id, `enabled: sessionId !== undefined`.
- **Zustand + persist:** `authStore` (`token`, `userName`, login/logout; `partialize` saves only data, not functions) and `uiStore` (dark mode persisted, search term intentionally NOT persisted). LocalStorage keys: `itelect4-auth`, `itelect4-ui`.
- **Derived API types** (`types/index.ts`): `ApiSession = Omit<Session, "id" | "createdAt"> & { id: string; createdAt: string }` — JSON has no Date and json-server makes string ids, so the API shapes are *derived* from the core interfaces, which stay the single source of truth. Same pattern for `ApiBooking` and `NewBooking = Omit<ApiBooking, "id">`.

**Likely questions**
- *"Why does the new booking appear without a page reload?"* → `invalidateQueries` marks the `["bookings"]` cache stale; a mounted `useQuery` watching that key refetches automatically.
- *"Why is the token in Zustand instead of useState?"* → Many components need it (nav bar, protected route) without prop-drilling; `persist` keeps you logged in across refreshes.
- *"Why `partialize`?"* → Functions can't become JSON — persist only `token`/`userName` (and only `isDarkMode`, because a stale search box would confuse people).
- *"Why `Omit` for the API types?"* → `id` and the date field change shape at the API boundary; deriving keeps the core interface the single source of truth.

---

## 📗 Session 8 — Forms: React Hook Form + Zod + Shadcn

**Where:** `src/schemas/bookingSchema.ts` · `src/pages/BookingsPage.tsx` · `LoginPage.tsx` · `SessionsPage.tsx` · `components/ui/*` · `src/lib/utils.ts`

- **One schema, two jobs:** `bookingSchema` (Zod) validates the user **at runtime**; `z.infer` derives `BookingFormValues` so TS checks **your code at compile time** — rules and type can never drift.
- **4 rules, one `.refine()`:** `sessionId` required → "Choose a session."; `note` required, ≤160 chars, and **≥3 words** (the refine — a rule Zod doesn't ship, written as a boolean function).
- **`useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema), mode: "onBlur", defaultValues: { sessionId: "", note: "" } })`** — one call replaces `useState`.
- `register("note")` spreads `{ name, onChange, onBlur, ref }` onto the `<Input>` — uncontrolled; a keystroke costs nothing.
- `<form onSubmit={handleSubmit(onSubmit)}>` — the **gate**: schema passes → `onSubmit(values)` runs the SAME Session 7 `useMutation`; fails → controller never runs, `errors` is filled, **zero network requests**.
- Every field renders its own message: `{errors.note && <p>{errors.note.message}</p>}`; `aria-invalid={errors.note ? true : undefined}` turns the border red — one attribute drives both look and screen readers.
- The submit button is **never disabled for invalid** — clicking it is what reveals the messages (the `!isValid` two-click trap). Only `isPending` disables it.
- `reset()` lives in `onSuccess` — fields clear **after** the save, together with `invalidateQueries`.
- **Shadcn = owned, not installed:** `npx shadcn add button input label` wrote real `.tsx` files into `src/components/ui/`; styles via `cva` variants; `cn()` (clsx + tailwind-merge) lets your `className` win. `components.json`, `src/lib/utils.ts` and `src/components/ui/` are committed — they're source, not node_modules.
- `LoginPage` keeps `useState` on purpose: one field, one rule, no schema needed. `SessionsPage` search box also uses `<Input>`.

**Likely questions**
- *"Why `z.infer` instead of writing the interface?"* → Add a field to the schema and the type follows in the same keystroke — hand-written types drift.
- *"Why does the select's value need `.min(1)`?"* → The placeholder `<option value="">` makes "not chosen" an empty string — so "required" for a string is "not empty".
- *"Why is the refine '≥3 words'?"* → It's a rule about MY data Zod doesn't ship — any boolean expression I can write.
- *"What happens on submit with invalid data?"* → Open DevTools Network tab: **nothing leaves the browser**; `onSubmit` is never called; `formState.errors` fills in.

---

## ⚡ "Find your own code" cheat table

| If they ask about… | Open this file |
|---|---|
| Your entities / enums / utility types | `src/types/index.ts` |
| A generic with a constraint | `src/index.ts` → `getById<T extends { id: number }>` |
| Props interface + variant | `src/components/ComplaintCard.tsx` |
| `children` in a component | `src/components/StatusBadge.tsx` |
| A custom hook | `src/hooks/useToggle.ts` · `usePrevious.ts` |
| Dark mode mechanism | `src/index.css` (line 2) + `Layout.tsx` wrapper div |
| Route table / 404 | `src/App.tsx` |
| The auth gate | `src/components/ProtectedRoute.tsx` |
| Dynamic route + `useParams` | `src/pages/SessionDetailPage.tsx` |
| Every fetch call | `src/api/client.ts` |
| Cache sharing (`queryKey`) | `BookingsPage` / `SessionsPage` / `DashboardPage` |
| `invalidateQueries` + `reset()` | `src/pages/BookingsPage.tsx` → `onSuccess` |
| Persist + `partialize` | `src/store/authStore.ts` · `uiStore.ts` |
| Zod rules + `.refine()` + `z.infer` | `src/schemas/bookingSchema.ts` |
| `useForm` + `zodResolver` + `errors` | `src/pages/BookingsPage.tsx` |
| Owned Button/Input/Label + `cva` | `src/components/ui/button.tsx` |

---

## 🎤 Mock defense — rapid fire

1. *"Show me your three core entities."* → `src/types/index.ts` — User, Session, Booking. Everything else derives from these.
2. *"Where does the session detail page get its data?"* → `useQuery(["sessions", sessionId])` → `fetchSessionById` from `client.ts`; the id comes from `useParams`.
3. *"What happens when I click Add booking with an empty form?"* → Schema fails both fields → messages render → `onSubmit` never runs → **no POST**.
4. *"And with valid data?"* → `onSubmit` → `createBooking` POST → `onSuccess` → `invalidateQueries(["bookings"])` refetches the list → `reset()` clears the form.
5. *"Why does your login survive a refresh?"* → `authStore` is wrapped in `persist` writing `itelect4-auth` to localStorage.
6. *"Why don't your searches survive a refresh?"* → `uiStore.partialize` only persists `isDarkMode` — on purpose.
7. *"What's in mockData and why?"* → Only `users` — there's no users endpoint yet; sessions/bookings moved to db.json in S7; real users come in Module 4.
8. *"What's the difference between ApiSession and Session?"* → API reality: string id, ISO-string date. Derived with `Omit` + intersection so the core interface stays the truth.
9. *"Where is your dark mode toggle and what does it change?"* → `Layout.tsx` button → `uiStore.toggleDarkMode` → one `.dark` class on the wrapper → `dark:` pairs react.
10. *"Show me a place TypeScript saved you."* → Passing a wrong field name to `register()` errors because `useForm<BookingFormValues>` is generic-typed; without the generic any string compiles.
11. *"Why is your Zod refine ≥3 words?"* → Real rule about booking notes: "yes" tells the tutor nothing; it's a boolean expression Zod doesn't ship.
12. *"What does `cn()` do?"* → Joins class strings AND resolves conflicts (tailwind-merge) — so a `className` you pass overrides the component's default instead of fighting it.

---

## 🧯 Quirks to own confidently (they WILL poke these)

- `ComplaintCard`/`UserCard` get `onSelect={() => {}}` in list pages — the Link navigates; the no-op keeps the required prop satisfied.
- `sample.ts` and `src/index.ts` are Session 1–2 playground files, kept to show progression.
- `DashboardPage`'s "Live activity" counter is a fake `setInterval` demo, not real data.
- The AI study tip on `SessionDetailPage` is a template string built with `useMemo` — no API behind it.
- Users still come from `mockData` until Module 4; everything else is real HTTP data.
- `db.json` has a `$schema` line and json-server-generated ids like `"c4BN-G3YUDQ"` — that's json-server, not a bug.

---

## ✅ 24-hour pre-defense checklist

1. `npm install && npm run api && npm run dev` — both terminals, app loads at `localhost:3000`.
2. `npm run build` — zero TS errors.
3. Click through: login → dashboard → sessions → detail → bookings → logout → 404 page.
4. Bookings form: empty submit (2 errors, no request), fix fields (messages clear), valid submit (card appears, no reload, fields clear).
5. Dark mode toggle + refresh (auth survives, search doesn't — know why).
6. Open `types/index.ts`, `client.ts`, `bookingSchema.ts`, `BookingsPage.tsx`, `ProtectedRoute.tsx` — practice finding each in ≤5 seconds.
7. Read this reviewer twice. Sleep. 🌙

*Generated from the actual repo files — every file path above is real and current as of the `gt3` tag.*



