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
    id: number;
    name: string;
    email: string;
    role: UserRole;
    bio: string;
    skills: string[];
    isActive: boolean;
}

export interface Session {
    id: number;
    title: string;
    subject: string;
    description: string;
    tutorId: number;
    tuteeId?: number;
    status: BookingStatus;
    createdAt: Date;
    sessionType: SessionType;
    meetingLink: string;
}

export interface Booking {
    id: number;
    sessionId: number;
    tuteeId: number;
    tutorId: number;
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
// JSON has no Date and json-server writes ids as strings, so what the API
// hands back is NOT the Session/Booking shape above. Both API types are
// DERIVED from the core entities, which stay the single source of truth.
export type ApiSession = Omit<Session, "id" | "createdAt"> & {
    id: string; // json-server ids look like "101"
    createdAt: string; // an ISO string, never a Date object
};

export type ApiBooking = Omit<Booking, "id" | "requestedAt"> & {
    id: string;
    requestedAt: string; // an ISO string, never a Date object
};

// What we SEND when creating one. No id yet -- the server makes it.
export type NewBooking = Omit<ApiBooking, "id">;