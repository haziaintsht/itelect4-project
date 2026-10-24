// src/api/client.ts
// Every call to the backend API lives in this one file.
// VITE_API_URL is baked in at BUILD time: locally it falls back to
// localhost:4000; on Vercel it is the backend's vercel.app address, set
// in the frontend project's Environment Variables.
import useAuthStore from "../store/authStore";
import type {
    ApiBooking,
    ApiSession,
    AuthResponse,
    NewBooking,
    UserRole,
} from "../types/index";

// A trailing slash is stripped so `${API_URL}/api/...` never has `//`.
export const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

// The JWT the login stored, as an Authorization header. Only the private
// routes (bookings) send it -- sessions and auth are public.
function authHeaders(): Record<string, string> {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Every error the API sends is JSON with a message, plus an errors list
// when a schema rule broke. Show the server's sentence, and fall back to
// ours only when the body is not JSON at all.
async function failure(res: Response, fallback: string): Promise<Error> {
    // A 401 while logged in means the stored token expired or was signed
    // with a different JWT_SECRET. Logging out lets ProtectedRoute send
    // the user back to /login instead of showing an error forever.
    if (res.status === 401 && useAuthStore.getState().token !== null) {
        useAuthStore.getState().logout();
    }
    const body = (await res.json().catch(() => null)) as {
        message?: string;
        errors?: string[];
    } | null;
    const message = body?.errors?.length ? body.errors.join(" ") : body?.message;
    return new Error(message ?? fallback);
}

// POST /api/auth/login -> { token, user }
export async function login(
    email: string,
    password: string
): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        throw await failure(res, "Login failed. Try again.");
    }
    return res.json();
}

// POST /api/auth/register -> { token, user }, already logged in
export async function register(
    name: string,
    email: string,
    password: string,
    role: UserRole
): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
        throw await failure(res, "Registration failed. Try again.");
    }
    return res.json();
}

// GET /api/sessions -> the whole list (public)
export async function fetchSessions(): Promise<ApiSession[]> {
    const res = await fetch(`${API_URL}/api/sessions`);
    if (!res.ok) {
        throw await failure(res, "Could not load sessions");
    }
    return res.json();
}

// GET /api/sessions/:id -> one session (public)
export async function fetchSessionById(id: string): Promise<ApiSession> {
    const res = await fetch(`${API_URL}/api/sessions/${id}`);
    if (!res.ok) {
        throw await failure(res, `Could not load session ${id}`);
    }
    return res.json();
}

// GET /api/bookings -> only the bookings YOU are part of (private)
export async function fetchBookings(): Promise<ApiBooking[]> {
    const res = await fetch(`${API_URL}/api/bookings`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        throw await failure(res, "Could not load bookings");
    }
    return res.json();
}

// POST /api/bookings -> the row the server saved, with the id it made
export async function createBooking(
    newBooking: NewBooking
): Promise<ApiBooking> {
    const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(newBooking),
    });
    if (!res.ok) {
        throw await failure(res, "Could not save the booking");
    }
    return res.json();
}
