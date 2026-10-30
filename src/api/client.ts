import useAuthStore from "../store/authStore";
import type {
    ApiBooking,
    ApiSession,
    AuthResponse,
    BookingStatus,
    NewBooking,
    NewSession,
    StudyPlan,
    UserRole,
} from "../types/index";

const API_URL = (
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

interface RequestOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
}

async function request<T>(
    path: string,
    fallback: string,
    { body, method = body === undefined ? "GET" : "POST" }: RequestOptions = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            ...authHeaders(),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
        throw await failure(res, fallback);
    }
    return res.status === 204 ? (undefined as T) : res.json();
}

export function login(email: string, password: string): Promise<AuthResponse> {
    return request("/api/auth/login", "Login failed. Try again.", {
        body: { email, password },
    });
}

export function register(
    name: string,
    email: string,
    password: string,
    role: UserRole
): Promise<AuthResponse> {
    return request("/api/auth/register", "Registration failed. Try again.", {
        body: { name, email, password, role },
    });
}

export function fetchSessions(): Promise<ApiSession[]> {
    return request("/api/sessions", "Could not load sessions");
}

export function fetchSessionById(id: string): Promise<ApiSession> {
    return request(`/api/sessions/${id}`, `Could not load session ${id}`);
}

export function fetchBookings(): Promise<ApiBooking[]> {
    return request("/api/bookings", "Could not load bookings");
}

export function createBooking(newBooking: NewBooking): Promise<ApiBooking> {
    return request("/api/bookings", "Could not save the booking", { body: newBooking });
}

export function updateBookingStatus(
    id: string,
    status: BookingStatus
): Promise<ApiBooking> {
    return request(`/api/bookings/${id}`, "Could not update the booking", {
        method: "PATCH",
        body: { status },
    });
}

export function deleteBooking(id: string): Promise<void> {
    return request(`/api/bookings/${id}`, "Could not remove the booking", {
        method: "DELETE",
    });
}

export function createSession(
    newSession: NewSession
): Promise<Pick<ApiSession, "id" | "title">> {
    return request("/api/sessions", "Could not create the session", { body: newSession });
}

export function askAi(prompt: string): Promise<StudyPlan> {
    return request("/api/ai", "The Study Planner could not answer. Try again.", {
        body: { prompt },
    });
}
