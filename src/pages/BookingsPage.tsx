// src/pages/BookingsPage.tsx
import StatusBadge from "../components/StatusBadge";
import { bookings, sessions, users } from "../data/mockData";

function BookingsPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">My Bookings</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Protected page -- only visible when you are logged in.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {bookings.map((booking) => {
                    const session = sessions.find((s) => s.id === booking.sessionId);
                    const tutor = users.find((u) => u.id === booking.tutorId);
                    return (
                        <div
                            key={booking.id}
                            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900"
                        >
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {session ? session.title : `Session #${booking.sessionId}`}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Tutor: {tutor ? tutor.name : "Unknown"}
                            </p>
                            <StatusBadge statusType={booking.status}>
                                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                                    {booking.requestedAt.toLocaleDateString()}
                                </span>
                            </StatusBadge>
                            <p className="mt-3 rounded-2xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {booking.note}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BookingsPage;
