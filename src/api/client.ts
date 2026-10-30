import useAuthStore from "../store/authStore";
import type {
    ApiBooking,
    ApiSession,
    AuthResponse,
    NewBooking,
    StudyPlan,
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

// Every call goes through here: JSON body, Bearer token when logged in,
// and the API's own error message when the response is not ok.
async function request<T>(
    path: string,
    fallback: string,
    body?: unknown
): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: {
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            ...authHeaders(),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
        throw await failure(res, fallback);
    }
    return res.json();
}

export function login(email: string, password: string): Promise<AuthResponse> {
    return request("/api/auth/login", "Login failed. Try again.", { email, password });
}

export function register(
    name: string,
    email: string,
    password: string,
    role: UserRole
): Promise<AuthResponse> {
    return request("/api/auth/register", "Registration failed. Try again.", {
        name,
        email,
        password,
        role,
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
    return request("/api/bookings", "Could not save the booking", newBooking);
}

export function askAi(prompt: string): Promise<StudyPlan> {
    return request("/api/ai", "The Study Planner could not answer. Try again.", { prompt });
}
