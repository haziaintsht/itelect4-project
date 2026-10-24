import useAuthStore from "../store/authStore";
import type {
    ApiBooking,
    ApiSession,
    AuthResponse,
    NewBooking,
    UserRole,
} from "../types/index";

export const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

function authHeaders(): Record<string, string> {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function failure(res: Response, fallback: string): Promise<Error> {
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

export async function fetchSessions(): Promise<ApiSession[]> {
    const res = await fetch(`${API_URL}/api/sessions`);
    if (!res.ok) {
        throw await failure(res, "Could not load sessions");
    }
    return res.json();
}

export async function fetchSessionById(id: string): Promise<ApiSession> {
    const res = await fetch(`${API_URL}/api/sessions/${id}`);
    if (!res.ok) {
        throw await failure(res, `Could not load session ${id}`);
    }
    return res.json();
}

export async function fetchBookings(): Promise<ApiBooking[]> {
    const res = await fetch(`${API_URL}/api/bookings`, {
        headers: authHeaders(),
    });
    if (!res.ok) {
        throw await failure(res, "Could not load bookings");
    }
    return res.json();
}

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
