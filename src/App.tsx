import React, { useEffect, useMemo, useRef, useState } from "react";
import UserCard from "./components/Usercard";
import ComplaintCard from "./components/ComplaintCard";
import StatusBadge from "./components/StatusBadge";
import usePrevious from "./hooks/usePrevious";
import useToggle from "./hooks/useToggle";
import { BookingStatus, SessionType, UserRole } from "./types/index";
import type { Booking, Session, User } from "./types/index";

const mockUsers: User[] = [
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
    const [sessions, setSessions] = useState<Session[]>([]);
    const [liveCount, setLiveCount] = useState<number>(2);
    const [aiSummary, setAiSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [showDetails, toggleDetails] = useToggle(false);
    const previousSearch = usePrevious(searchTerm);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setLiveCount((value) => value + 1);
        }, 4000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSessions(mockSessions);
            setIsLoading(false);
        }, 500);

        return () => window.clearTimeout(timer);
    }, []);

    const selectedSession = sessions.find((session) => session.id === selectedSessionId) ?? sessions[0] ?? mockSessions[0];
    const selectedTutor = mockUsers.find((user) => user.id === selectedSession.tutorId) ?? mockUsers[0];
    const selectedBooking = mockBookings.find((booking) => booking.sessionId === selectedSession.id) ?? mockBookings[0];

    const generatedSuggestion = useMemo(() => {
        const topic = selectedSession.subject.toLowerCase();
        const tutorName = selectedTutor.name.split(" ")[0];
        const note = selectedBooking.note.toLowerCase();

        return `AI study tip: ${tutorName} suggests a focused ${topic} session that starts with a 5-minute review of the toughest concept, follows with one worked example, and ends with a quick practice quiz. Since the booking note says "${note}", the plan should emphasize confidence-building and clear step-by-step explanations.`;
    }, [selectedBooking.note, selectedSession.subject, selectedTutor.name]);

    const filteredSessions = sessions.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const focusSearch = (): void => {
        searchInputRef.current?.focus();
    };

    if (isLoading) {
        return <p style={{ padding: "24px" }}>Loading sessions...</p>;
    }

    return (
        <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif", background: "linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)", minHeight: "100vh", color: "#0f172a" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
                    <div>
                        <h1 style={{ margin: "0 0 8px", fontSize: "32px" }}>Peer Tutoring Booking Platform</h1>
                        <p style={{ margin: 0, color: "#475569", fontSize: "16px" }}>Book support, track sessions, and get a smart study plan in one place.</p>
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ padding: "12px 16px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)", border: "1px solid #e2e8f0" }}>
                            <strong style={{ color: "#2563eb" }}>Live activity:</strong> {liveCount} new tutor requests updated recently.
                        </div>
                        <button onClick={toggleDetails} style={{ border: "none", background: "#0f172a", color: "#fff", padding: "10px 14px", borderRadius: "999px", cursor: "pointer" }}>
                            {showDetails ? "Hide" : "Show"} details
                        </button>
                    </div>
                </div>

                <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "1.15fr 0.85fr" }}>
                    <section>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0 }}>Available Sessions</h2>
                            <span style={{ color: "#64748b", fontSize: "14px" }}>{filteredSessions.length} session(s) ready</span>
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                            <input
                                ref={searchInputRef}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search sessions..."
                                style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                            />
                            <button onClick={focusSearch} style={{ border: "none", background: "#2563eb", color: "#fff", padding: "10px 12px", borderRadius: "10px", cursor: "pointer" }}>
                                Focus
                            </button>
                        </div>

                        {previousSearch !== undefined && previousSearch !== searchTerm && (
                            <p style={{ marginBottom: "10px", color: "#64748b" }}>Previous search: "{previousSearch}"</p>
                        )}

                        {showDetails && <p style={{ marginBottom: "10px", color: "#334155" }}>Custom hook demo is active.</p>}

                        {filteredSessions.map((session) => (
                            <ComplaintCard key={session.id} session={session} onSelect={() => setSelectedSessionId(session.id)} />
                        ))}
                    </section>

                    <aside>
                        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Selected Session</h2>
                        <div style={{ border: "1px solid #dbeafe", borderRadius: "18px", padding: "18px", background: "#ffffff", boxShadow: "0 10px 30px rgba(148, 163, 184, 0.15)" }}>
                            <h3 style={{ marginTop: 0, marginBottom: "8px" }}>{selectedSession.title}</h3>
                            <p style={{ marginTop: 0, color: "#475569", lineHeight: 1.6 }}>{selectedSession.description}</p>
                            <StatusBadge statusType={selectedSession.status}>
                                <span style={{ display: "block", marginTop: "6px" }}>Meeting type: {selectedSession.sessionType}</span>
                            </StatusBadge>

                            <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />

                            <h4 style={{ marginBottom: "6px" }}>Booking note</h4>
                            <p style={{ marginTop: 0, color: "#334155" }}>{selectedBooking.note}</p>

                            <h4 style={{ marginBottom: "6px" }}>Assigned tutor</h4>
                            <UserCard user={selectedTutor} onSelect={setSelectedUser} />
                            {selectedUser && <p style={{ marginTop: "8px", color: "#1d4ed8" }}>Selected tutor: {selectedUser.name}</p>}

                            <button
                                onClick={() => setAiSummary(generatedSuggestion)}
                                style={{
                                    marginTop: "12px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                                    color: "#ffffff",
                                    padding: "10px 14px",
                                    borderRadius: "999px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.22)"
                                }}
                            >
                                Generate AI Study Tip
                            </button>
                            {aiSummary ? <p style={{ marginTop: "12px", color: "#1d4ed8", background: "#eff6ff", padding: "10px 12px", borderRadius: "10px", lineHeight: 1.5 }}>{aiSummary}</p> : null}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default App;