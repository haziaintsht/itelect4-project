// src/pages/DashboardPage.tsx
// SESSION 7: the session count now comes from json-server (shared cache
// with SessionsPage). users still comes from mockData until Module 4.
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserCard from "../components/Usercard";
import useToggle from "../hooks/useToggle";
import { users } from "../data/mockData";
import { fetchSessions } from "../api/client";
import type { ApiSession, User } from "../types/index";

function DashboardPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetails, toggleDetails] = useToggle(false);
    const [liveCount, setLiveCount] = useState<number>(2);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setLiveCount((value) => value + 1);
        }, 4000);

        return () => window.clearInterval(interval);
    }, []);

    // Same ["sessions"] key as SessionsPage -- one request serves both
    const { data: sessions } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Overview of tutors and live activity.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Live activity</p>
                        <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100">{liveCount}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">new tutor requests updated recently.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Sessions available</p>
                        <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100">{(sessions ?? []).length}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Tutors</p>
                        <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100">
                            {users.filter((u) => u.role === "tutor").length}
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">active tutors on the platform.</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-slate-100">Tutors</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} onSelect={setSelectedUser} />
                    ))}
                </div>
                <button
                    onClick={toggleDetails}
                    className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                >
                    {showDetails ? "Hide" : "Show"} Details
                </button>
                {showDetails && selectedUser !== null && (
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Selected: {selectedUser.name} ({selectedUser.role})
                    </p>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
