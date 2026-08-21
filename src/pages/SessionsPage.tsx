// src/pages/SessionsPage.tsx
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import ComplaintCard from "../components/ComplaintCard";
import usePrevious from "../hooks/usePrevious";
import { sessions as mockSessions } from "../data/mockData";
import type { Session } from "../types/index";

function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const previousSearch = usePrevious(searchTerm);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSessions(mockSessions);
            setIsLoading(false);
        }, 500);

        return () => window.clearTimeout(timer);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const focusSearch = (): void => {
        searchInputRef.current?.focus();
    };

    const filteredSessions = sessions.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="animate-pulse rounded-3xl bg-white p-8 text-slate-500 dark:bg-slate-900 dark:text-slate-400">Loading sessions...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-red-700 dark:bg-red-900 dark:text-red-200">
                Could not load sessions. Please try again.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Sessions</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Browse and book a tutoring session.</p>
                </div>
                <button
                    onClick={() => setIsError(true)}
                    className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                    Simulate Error
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Search sessions</p>
                    <div className="mt-3 flex gap-3">
                        <input
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search sessions..."
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {previousSearch !== undefined && previousSearch !== searchTerm
                            ? `Previous search: "${previousSearch}"`
                            : "No previous search yet."}
                    </p>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Available Sessions</h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{filteredSessions.length} session(s) ready</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    {filteredSessions.map((session) => (
                        <Link key={session.id} to={`/sessions/${session.id}`}>
                            <ComplaintCard session={session} onSelect={() => {}} variant="compact" />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default SessionsPage;
