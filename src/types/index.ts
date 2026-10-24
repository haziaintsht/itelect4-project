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

// ===== API SHAPES (SESSION 10) =====
// What itelect4-backend actually sends, which is NOT the Session/Booking
// shape above. JSON has no Date, so dates are ISO strings. Each model's
// toJSON renames Mongo's _id to id. And references come back populated:
// a session carries its tutor, a booking its session, tutee and tutor --
// or null, if that document has since been deleted. Every API type is
// DERIVED from the core entities, which stay the single source of truth.
export type ApiSession = Omit<Session, "createdAt" | "tutorId" | "tuteeId"> & {
    createdAt: string; // an ISO string, never a Date object
    tutor: Pick<User, "id" | "name" | "email"> | null; // .populate("tutor", "name email")
};

export type ApiBooking = Omit<
    Booking,
    "sessionId" | "tuteeId" | "tutorId" | "requestedAt"
> & {
    session: Pick<Session, "id" | "title" | "subject"> | null;
    tutee: Pick<User, "id" | "name"> | null;
    tutor: Pick<User, "id" | "name"> | null;
    createdAt: string; // when it was requested -- set by the server
};

// What we SEND when creating one: which session, and the note. The
// server fills in the rest -- the tutee is whoever the token belongs to,
// the tutor comes from the session, the status starts at "requested".
export type NewBooking = { session: string; note: string };

// What POST /api/auth/login and /api/auth/register send back.
export type AuthUser = Pick<User, "id" | "name" | "email" | "role">;

export interface AuthResponse {
    token: string; // a JWT signed by the backend's JWT_SECRET
    user: AuthUser;
}