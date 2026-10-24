// src/api/client.ts
// Every call to the backend API lives in this one file.
// API_URL comes from Vite env (VITE_API_URL) or falls back to localhost:4000.
import type { ApiSession, ApiBooking, NewBooking } from "../types/index";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Reads the JWT from localStorage and attaches it as a Bearer header.
// Returns empty headers when no token exists (public routes like sessions).
function authHeaders(): HeadersInit {
  if (typeof localStorage === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// POST /api/auth/login -> { token, user }
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password");
  }
  return res.json();
}

// POST /api/auth/register -> { token, user }
export async function register(
  name: string,
  email: string,
  password: string,
  role?: string
): Promise<{ token: string; user: { id: string; name: string; email: string; role: string } }> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Registration failed" }));
    throw new Error(error.message || "Registration failed");
  }
  return res.json();
}

// GET /api/sessions -> the whole list
export async function fetchSessions(): Promise<ApiSession[]> {
    const res = await fetch(`${API_URL}/api/sessions`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        throw new Error("Could not load sessions");
    }
    return res.json();
}

// GET /api/sessions/:id -> one session
export async function fetchSessionById(id: string): Promise<ApiSession> {
    const res = await fetch(`${API_URL}/api/sessions/${id}`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        throw new Error(`Could not load session ${id}`);
    }
    return res.json();
}

// GET /api/bookings -> the whole list (filtered on the client)
export async function fetchBookings(): Promise<ApiBooking[]> {
    const res = await fetch(`${API_URL}/api/bookings`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        throw new Error("Could not load bookings");
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
        throw new Error("Could not save the booking");
    }
    return res.json();
}
