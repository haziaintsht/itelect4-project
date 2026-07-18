import React, { useEffect, useMemo, useState } from "react";
import UserCard from "./components/Usercard";
import ComplaintCard from "./components/ComplaintCard";
import StatusBadge from "./components/StatusBadge";
import { BookingStatus, SessionType, UserRole } from "./types/index";
import type { Booking, Session, User } from "./types/index";

const mockUsers: User[] = [
    {
        id: 1,
        name: "Mina Santos",
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

const mockSessions: Session[] = [
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

const mockBookings: Booking[] = [
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

function App() {
    const [selectedSessionId, setSelectedSessionId] = useState<number>(mockSessions[0].id);
    const [liveCount, setLiveCount] = useState<number>(2);
    const [aiSummary, setAiSummary] = useState<string>("");

    useEffect(() => {
        const interval = window.setInterval(() => {
            setLiveCount((value) => value + 1);
        }, 4000);

        return () => window.clearInterval(interval);
    }, []);

    const selectedSession = mockSessions.find((session) => session.id === selectedSessionId) ?? mockSessions[0];
    const selectedTutor = mockUsers.find((user) => user.id === selectedSession.tutorId) ?? mockUsers[0];
    const selectedBooking = mockBookings.find((booking) => booking.sessionId === selectedSession.id) ?? mockBookings[0];

    const generatedSuggestion = useMemo(() => {
        return `AI suggestion: Prepare a ${selectedSession.subject.toLowerCase()} study plan with a short warm-up, one worked example, and a recap quiz for ${selectedTutor.name.split(" ")[0]}.`;
    }, [selectedSession.subject, selectedTutor.name]);

    return (
        <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
            <h1>Peer Tutoring Booking Platform</h1>
            <p style={{ color: "#475569" }}>A simple semester-ready app for tutoring requests, booking flow, and live updates.</p>

            <div style={{ marginBottom: "18px", padding: "12px 14px", background: "#ecfeff", borderRadius: "10px", display: "inline-block" }}>
                <strong>Live activity:</strong> {liveCount} new tutor requests updated in the last few seconds.
            </div>

            <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.2fr 0.8fr" }}>
                <section>
                    <h2>Available Sessions</h2>
                    {mockSessions.map((session) => (
                        <ComplaintCard key={session.id} session={session} onSelect={() => setSelectedSessionId(session.id)} />
                    ))}
                </section>

                <aside>
                    <h2>Selected Session Detail</h2>
                    <div style={{ border: "1px solid #dbeafe", borderRadius: "12px", padding: "16px", background: "#ffffff" }}>
                        <h3>{selectedSession.title}</h3>
                        <p>{selectedSession.description}</p>
                        <StatusBadge statusType={selectedSession.status}>
                            <span style={{ display: "block", marginTop: "6px" }}>Meeting type: {selectedSession.sessionType}</span>
                        </StatusBadge>

                        <hr />

                        <h4>Booking note</h4>
                        <p>{selectedBooking.note}</p>

                        <h4>Assigned tutor</h4>
                        <UserCard user={selectedTutor} onSelect={() => undefined} />

                        <button onClick={() => setAiSummary(generatedSuggestion)} style={{ marginTop: "10px" }}>
                            Generate AI Study Tip
                        </button>
                        {aiSummary ? <p style={{ marginTop: "10px", color: "#1d4ed8" }}>{aiSummary}</p> : null}
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default App;