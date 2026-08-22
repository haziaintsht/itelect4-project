// src/pages/SessionsPage.tsx
// SESSION 7: the three useState calls, the useEffect and the setTimeout
// are gone -- useQuery owns loading, caching and refetching now. The
// search box reads and writes the uiStore, not local state.
import React, { useRef } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ComplaintCard from "../components/ComplaintCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchSessions } from "../api/client";
import type { ApiSession } from "../types/index";

function SessionsPage() {
    // The search box now reads and writes the store, not local state
    const searchTerm = useUiStore((state) => state.searchTerm);
    const setSearchTerm = useUiStore((state) => state.setSearchTerm);
    const previousSearch = usePrevious(searchTerm);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // These four lines replace ALL of Session 6's fetching state
    const { data, isPending, isError, error } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const focusSearch = (): void => {
        searchInputRef.current?.focus();
    };

    if (isPending) {
        return <div className="animate-pulse rounded-3xl bg-white p-8 text-slate-500 dark:bg-slate-900 dark:text-slate-400">Loading sessions...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-red-700 dark:bg-red-900 dark:text-red-200">
                {error?.message ?? "Could not load sessions."} -- is json-server running on port 3001?
            </div>
        );
    }

    // Below this line data is ApiSession[], never undefined
    const filteredSessions = data.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">Sessions</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Browse and book a tutoring session.</p>
                </div>
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
