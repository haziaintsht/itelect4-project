
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


export type ID = number | string;
export type StringOrNumber = string | number;


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


export type SessionUpdate = Partial<Session>;
export type PublicTutorView = Omit<User, "email">;
export type StatusCounts = Record<BookingStatus, number>;








export type ApiSession = Omit<Session, "createdAt" | "tutorId" | "tuteeId"> & {
    createdAt: string; 
    tutor: Pick<User, "id" | "name" | "email"> | null; 
};

export type ApiBooking = Omit<
    Booking,
    "sessionId" | "tuteeId" | "tutorId" | "requestedAt"
> & {
    session: Pick<Session, "id" | "title" | "subject"> | null;
    tutee: Pick<User, "id" | "name"> | null;
    tutor: Pick<User, "id" | "name"> | null;
    createdAt: string; 
};




export type NewBooking = { session: string; note: string };


export type AuthUser = Pick<User, "id" | "name" | "email" | "role">;

export interface AuthResponse {
    token: string; 
    user: AuthUser;
}