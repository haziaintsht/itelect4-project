// src/data/mockData.ts
// SESSION 7: sessions and bookings moved to db.json and are served by
// json-server -- they must not be imported anywhere any more.
//
// users stays. There is no /users endpoint and no real login until
// Module 4 -- the tutor list and the tutor lookup are still local, on
// purpose. When real users arrive, this file disappears completely.
import { UserRole } from "../types/index";
import type { User } from "../types/index";

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

