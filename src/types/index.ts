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

// What the API sends back: ids are strings, dates arrive as ISO strings,
// and the tutor/tutee/session references are populated objects.
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

// Mirrors studyPlanSchema in itelect4-backend/src/schemas/studyPlan.ts.
export type StudyLevel = "beginner" | "intermediate" | "advanced";

export interface StudyPlan {
    summary: string;
    focusTopics: string[];
    level: StudyLevel;
    suggestedSubject: string;
}
