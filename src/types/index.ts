// ===== ENUMS =====
export enum UserRole {
    TUTOR = "tutor",
    TUTEE = "tutee"
}

export enum BookingStatus {
    REQUESTED = "requested",
    CONFIRMED = "confirmed",
    COMPLETED = "completed"
}

export enum SessionType {
    ONE_ON_ONE = "one-on-one",
    GROUP = "group"
}

// ===== INTERFACES (The 3 Core Entities) =====
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    bio: string;
    skills: string[];
    isActive: boolean;
}

export interface Session {
    id: string;
    title: string;
    subject: string;
    description: string;
    tutorId: string;
    tuteeId?: string;
    status: BookingStatus;
    createdAt: Date;
    sessionType: SessionType;
    meetingLink: string;
}

export interface Booking {
    id: string;
    sessionId: string;
    tuteeId: string;
    tutorId: string;
    status: BookingStatus;
    requestedAt: Date;
    note: string;
}

// ===== TYPE ALIASES & UNIONS =====
export type ID = number | string;
export type StringOrNumber = string | number;

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ===== UTILITY TYPES =====
export type SessionUpdate = Partial<Session>;
export type PublicTutorView = Omit<User, "email">;
export type StatusCounts = Record<BookingStatus, number>;

// ===== API SHAPES (SESSION 7) =====
// JSON has no Date and MongoDB writes ids as ObjectIds, so what the API
// hands back is NOT the Session/Booking shape above. Both API types are
// DERIVED from the core entities, which stay the single source of truth.
// Sessions come back with `tutor` populated (name, email) because the
// backend runs .populate("tutor", "name email") on every session query.
export type ApiSession = Omit<Session, "id" | "createdAt" | "tutorId"> & {
    id: string; // MongoDB ObjectId as a string
    createdAt: string; // an ISO string, never a Date object
    tutor?: { name: string; email: string }; // populated by the backend
};

export type ApiBooking = Omit<Booking, "id" | "requestedAt"> & {
    id: string;
    requestedAt: string; // an ISO string, never a Date object
};

// What we SEND when creating one. No id yet -- the server makes it.
export type NewBooking = Omit<ApiBooking, "id">;