// src/pages/SessionDetailPage.tsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import StatusBadge from "../components/StatusBadge";
import UserCard from "../components/Usercard";
import { bookings, sessions, users } from "../data/mockData";

function SessionDetailPage() {
    // Reads whatever is in the :sessionId slot of the URL
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    // Turn that string into a real number, then find the session
    const sessionIdNumber = Number(sessionId);
    const session = sessions.find((s) => s.id === sessionIdNumber);

    const tutor = users.find((user) => user.id === session?.tutorId);
    const booking = bookings.find((b) => b.sessionId === session?.id);

    const generatedSuggestion = useMemo(() => {
        if (session === undefined || tutor === undefined || booking === undefined) {
            return "";
        }
        const topic = session.subject.toLowerCase();
        const tutorName = tutor.name.split(" ")[0];
        const note = booking.note.toLowerCase();

        return `AI study tip: ${tutorName} suggests a focused ${topic} session that starts with a 5-minute review of the toughest concept, follows with one worked example, and ends with a quick practice quiz. Since the booking note says "${note}", the plan should emphasize confidence-building and clear step-by-step explanations.`;
    }, [booking, session, tutor]);

    // The URL is user input -- they can type anything. Handle that.
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
