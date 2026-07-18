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