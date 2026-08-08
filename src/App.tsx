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
    const [isError, setIsError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDarkMode, toggleDarkMode] = useToggle(false);
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
        return (
            <div className={isDarkMode ? "dark" : ""}>
                <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70 animate-pulse dark:bg-slate-900 dark:shadow-none">
                        Loading sessions...
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={isDarkMode ? "dark" : ""}>
                <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <div className="mx-auto max-w-3xl rounded-3xl bg-red-50 p-8 text-red-700 shadow-lg shadow-red-200/70 dark:bg-red-900 dark:text-red-200 dark:shadow-none">
                        Could not load sessions. Please try again.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100">Peer Tutoring Booking Platform</h1>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Book support, track sessions, and get a smart study plan in one place.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={toggleDarkMode}
                                    className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-300"
                                >
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </button>
                                <button
                                    onClick={() => setIsError(true)}
                                    className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                                >
                                    Simulate Error
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-300">Live activity</p>
                                <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100">{liveCount}</p>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">new tutor requests updated recently.</p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-300">Search sessions</p>
                                <div className="mt-3 flex gap-3">
                                    <input
                                        ref={searchInputRef}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search sessions..."
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                                    />
                                    <button
                                        onClick={focusSearch}
                                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-300"
                                    >
                                        Focus
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-sm text-slate-600 dark:text-slate-300">Search status</p>
                                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{previousSearch !== undefined && previousSearch !== searchTerm ? `Previous search: "${previousSearch}"` : "No previous search yet."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                        <section className="space-y-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Available Sessions</h2>
                                <span className="text-sm text-slate-500 dark:text-slate-400">{filteredSessions.length} session(s) ready</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {filteredSessions.map((session) => (
                                    <ComplaintCard key={session.id} session={session} onSelect={() => setSelectedSessionId(session.id)} variant="compact" />
                                ))}
                            </div>
                        </section>

                        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Selected Session</h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review the selected session details below.</p>
                                </div>
                                <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-100">{selectedSession.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedSession.description}</p>
                                    </div>
                                    <StatusBadge statusType={selectedSession.status}>
                                        <span className="inline-block mt-2 text-sm text-slate-500 dark:text-slate-400">Meeting type: {selectedSession.sessionType}</span>
                                    </StatusBadge>
                                    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Booking note</h4>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedBooking.note}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assigned tutor</h4>
                                        <UserCard user={selectedTutor} onSelect={setSelectedUser} />
                                        {selectedUser && <p className="text-sm text-slate-500 dark:text-slate-400">Selected tutor: {selectedUser.name}</p>}
                                    </div>
                                    <button
                                        onClick={() => setAiSummary(generatedSuggestion)}
                                        className="rounded-full bg-gradient-to-r from-sky-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:opacity-95"
                                    >
                                        Generate AI Study Tip
                                    </button>
                                    {aiSummary ? (
                                        <p className="rounded-3xl bg-sky-50 px-4 py-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">{aiSummary}</p>
                                    ) : null}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
