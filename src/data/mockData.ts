// src/data/mockData.ts
// Session 5 kept users, sessions and bookings at the top of App.tsx.
// Several pages need that data now, so it moves into its own file.
import { BookingStatus, SessionType, UserRole } from "../types/index";
import type { Booking, Session, User } from "../types/index";

export const users: User[] = [
    {
        id: 1,
        name: "Sophia Ramos",
        email: "mina@school.edu",
        role: UserRole.TUTOR,
        bio: "Calculus and programming mentor with a patient teaching style.",
        skills: ["Calculus", "TypeScript", "Study planning"],
        isActive: true
    },
    {
        id: 2,
        name: "Jessa Cruz",
        email: "jessa@school.edu",
        role: UserRole.TUTEE,
        bio: "Needs help preparing for midterms and lab reports.",
        skills: ["Writing", "Design"],
        isActive: true
    }
];

export const sessions: Session[] = [
    {
        id: 101,
        title: "Calculus Crash Course",
        subject: "Calculus",
        description: "Review limits, derivatives, and exam strategy before finals week.",
        tutorId: 1,
        tuteeId: 2,
        status: BookingStatus.REQUESTED,
        createdAt: new Date("2026-07-18T09:00:00"),
        sessionType: SessionType.ONE_ON_ONE,
        meetingLink: "https://meet.example.com/calculus"
    },
    {
        id: 102,
        title: "TypeScript Debugging Lab",
        subject: "Programming",
        description: "Walk through a React + TypeScript bug and improve confidence quickly.",
        tutorId: 1,
        status: BookingStatus.CONFIRMED,
        createdAt: new Date("2026-07-18T11:00:00"),
        sessionType: SessionType.GROUP,
        meetingLink: "https://meet.example.com/typescript"
    }
];

export const bookings: Booking[] = [
    {
        id: 201,
        sessionId: 101,
        tuteeId: 2,
        tutorId: 1,
        status: BookingStatus.REQUESTED,
        requestedAt: new Date("2026-07-18T08:45:00"),
        note: "Please help with derivative practice before the exam."
    },
    {
        id: 202,
        sessionId: 102,
        tuteeId: 2,
        tutorId: 1,
        status: BookingStatus.CONFIRMED,
        requestedAt: new Date("2026-07-18T10:30:00"),
        note: "I will bring my current code errors and questions."
    }
];
