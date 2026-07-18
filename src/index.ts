import type {
    User,
    Session,
    Booking,
    StringOrNumber,
    ApiResponse,
    SessionUpdate,
    PublicTutorView,
    StatusCounts
} from "./types/index";

import { BookingStatus, SessionType, UserRole } from "./types/index";

const projectName: string = "Peer Tutoring Booking Platform";
const currentYear: number = 2026;
const isFullStack: boolean = true;

function greetProject(name: string, year: number): string {
    return `Welcome to ${name} Workspace -- AY ${year}!`;
}
console.log(greetProject(projectName, currentYear));

const tutor: User = {
    id: 1,
    name: "Mina Santos",
    email: "mina@example.com",
    role: UserRole.TUTOR,
    bio: "Calculus and coding mentor",
    skills: ["Calculus", "TypeScript"],
    isActive: true,
};

const session: Session = {
    id: 101,
    title: "Calculus Crash Course",
    subject: "Calculus",
    description: "Session for midterm prep.",
    tutorId: 1,
    status: BookingStatus.REQUESTED,
    createdAt: new Date(),
    sessionType: SessionType.ONE_ON_ONE,
    meetingLink: "https://meet.example.com/calc"
};

const booking: Booking = {
    id: 201,
    sessionId: 101,
    tuteeId: 2,
    tutorId: 1,
    status: BookingStatus.REQUESTED,
    requestedAt: new Date(),
    note: "Need help with derivatives before the exam."
};

function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

const foundTutor = getById<User>([tutor], 1);
console.log(`Found Tutor: ${foundTutor?.name}`);

const sessionResponse: ApiResponse<Session> = {
    success: true,
    message: "Session loaded.",
    data: session
};
console.log(`Session Topic: ${sessionResponse.data.subject}`);

const updatePayload: SessionUpdate = { status: BookingStatus.CONFIRMED };

const publicView: PublicTutorView = {
    id: 1,
    name: "Mina Santos",
    role: UserRole.TUTOR,
    bio: "Calculus and coding mentor",
    skills: ["Calculus", "TypeScript"],
    isActive: true
};

const counts: StatusCounts = {
    [BookingStatus.REQUESTED]: 3,
    [BookingStatus.CONFIRMED]: 2,
    [BookingStatus.COMPLETED]: 1
};

function generateSessionNote(subject: string, tutorName: string): string {
    return `Suggested note: ${tutorName} can help you strengthen ${subject} with a short practice set.`;
}

type SessionNote = ReturnType<typeof generateSessionNote>;
const note: SessionNote = generateSessionNote(session.subject, tutor.name);
console.log(note);