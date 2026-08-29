// src/pages/SessionDetailPage.tsx
// SESSION 7: the session comes from json-server, keyed by the id in the
// URL, and bookings come from the API too. users stays in mockData until
// Module 4 brings real users.
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import StatusBadge from "../components/StatusBadge";
import UserCard from "../components/Usercard";
import { fetchSessionById, fetchBookings } from "../api/client";
import { users } from "../data/mockData";
import type { ApiSession, ApiBooking } from "../types/index";

function SessionDetailPage() {
    // Reads whatever is in the :sessionId slot of the URL
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    // The id from the URL goes INTO the key, so /sessions/101 and
    // /sessions/102 get one cache entry each instead of sharing one.
    const {
        data: session,
        isPending,
        isError,
        error,
    } = useQuery<ApiSession>({
        queryKey: ["sessions", sessionId],
        queryFn: () => fetchSessionById(sessionId!),
        enabled: sessionId !== undefined, // do not run without an id
    });

    // The whole bookings list (shared cache with BookingsPage); the match
    // for THIS session is found on the client.
    const { data: allBookings } = useQuery<ApiBooking[]>({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
    });

    const booking = (allBookings ?? []).find(
        (b) => b.sessionId === Number(sessionId)
    );

    // users still come from mockData; ids are numbers on both sides
    const tutor = session !== undefined
        ? users.find((user) => user.id === session.tutorId)
        : undefined;

    const generatedSuggestion = useMemo(() => {
        if (session === undefined || tutor === undefined || booking === undefined) {
            return "";
        }
        const topic = session.subject.toLowerCase();
        const tutorName = tutor.name.split(" ")[0];
        const note = booking.note.toLowerCase();

        return `AI study tip: ${tutorName} suggests a focused ${topic} session that starts with a 5-minute review of the toughest concept, follows with one worked example, and ends with a quick practice quiz. Since the booking note says "${note}", the plan should emphasize confidence-building and clear step-by-step explanations.`;
    }, [booking, session, tutor]);

    // A bad code makes fetchSessionById throw, and the throw lands here.
    if (isPending) {
        return <div className="animate-pulse rounded-3xl bg-white p-8 text-slate-500 dark:bg-slate-900 dark:text-slate-400">Loading session...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-red-700 dark:bg-red-900 dark:text-red-200">
                {error?.message ?? `No session found with id "${sessionId}".`}
            </div>
        );
    }

    // Defensive: rules out undefined so TypeScript can narrow below.
    if (session === undefined) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-red-700 dark:bg-red-900 dark:text-red-200">
                No session found with id "{sessionId}".
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">{session.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Subject: {session.subject}</p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{session.description}</p>
                <StatusBadge statusType={session.status}>
                    <span className="ml-2 inline-block text-sm text-slate-500 dark:text-slate-400">
                        Meeting type: {session.sessionType}
                    </span>
                </StatusBadge>
                {booking && (
                    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Booking note</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{booking.note}</p>
                    </div>
                )}
                {tutor && (
                    <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Assigned tutor</h4>
                        <UserCard user={tutor} onSelect={() => {}} />
                    </div>
                )}
                {generatedSuggestion && (
                    <p className="mt-4 rounded-3xl bg-sky-50 px-4 py-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {generatedSuggestion}
                    </p>
                )}
            </div>

            <button
                onClick={() => navigate("/sessions")}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
            >
                Back to Sessions
            </button>
        </div>
    );
}

export default SessionDetailPage;
