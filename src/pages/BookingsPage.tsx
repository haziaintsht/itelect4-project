// src/pages/BookingsPage.tsx
// SESSION 7: bookings come from json-server via useQuery, and the Add
// form uses useMutation -- on success it invalidates ["bookings"] so the
// list refetches itself without a page reload.
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../components/StatusBadge";
import { users } from "../data/mockData";
import { fetchBookings, fetchSessions, createBooking } from "../api/client";
import { BookingStatus } from "../types/index";
import type { ApiBooking, ApiSession } from "../types/index";

function BookingsPage() {
    // Local, because only this one form reads it. Not store material.
    const [note, setNote] = useState<string>("");
    const queryClient = useQueryClient();

    // 1. READ -- same useQuery pattern as SessionsPage
    const { data: bookings, isPending, isError } = useQuery<ApiBooking[]>({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
    });

    // Session titles, for the card headings (shares the SessionsPage cache)
    const { data: sessions } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    // 2. WRITE -- mutationFn does the POST, onSuccess cleans up after it
    const addBooking = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            // "the bookings list is out of date now -- go and refetch it"
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            setNote("");
        },
    });

    const handleAdd = (): void => {
        addBooking.mutate({
            sessionId: 101,
            tuteeId: 2,
            tutorId: 1,
            status: BookingStatus.REQUESTED,
            requestedAt: new Date().toISOString(), // a STRING, not a Date
            note,
        });
    };

    if (isPending) {
        return <div className="animate-pulse rounded-3xl bg-white p-8 text-slate-500 dark:bg-slate-900 dark:text-slate-400">Loading bookings...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-3xl bg-red-50 p-8 text-red-700 dark:bg-red-900 dark:text-red-200">
                Could not load bookings. Is json-server running on port 3001?
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">My Bookings</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Protected page -- only visible when you are logged in.
                </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">Request a booking for "Calculus Crash Course"</p>
                <div className="mt-3 flex gap-3">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What do you need help with?"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={note === "" || addBooking.isPending}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-400 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                    >
                        {addBooking.isPending ? "Saving..." : "Add"}
                    </button>
                </div>
                {addBooking.isError && addBooking.error && (
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">{addBooking.error.message}</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {(bookings ?? []).map((booking) => {
                    const session = (sessions ?? []).find(
                        (s) => s.id === String(booking.sessionId)
                    );
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
                                    {new Date(booking.requestedAt).toLocaleDateString()}
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
