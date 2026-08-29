// src/pages/BookingsPage.tsx
// SESSION 8: bookings come from json-server via useQuery, and the Add
// form now uses React Hook Form + a Zod resolver -- the schema decides
// what reaches the SAME useMutation from Session 7. onSuccess still
// invalidates ["bookings"], and reset() clears the fields after the save.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StatusBadge from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { users } from "../data/mockData";
import { fetchBookings, fetchSessions, createBooking } from "../api/client";
import { bookingSchema } from "../schemas/bookingSchema";
import type { BookingFormValues } from "../schemas/bookingSchema";
import { BookingStatus } from "../types/index";
import type { ApiBooking, ApiSession } from "../types/index";
// The useState import is GONE -- useForm holds the values now

function BookingsPage() {
    const queryClient = useQueryClient();

    // useForm holds the values, runs the schema, and stores the errors.
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        mode: "onBlur",
        defaultValues: { sessionId: "", note: "" },
    });

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
            reset(); // clears every field at once -- only AFTER the save
        },
    });

    // handleSubmit only calls this after the schema passes.
    const onSubmit = (values: BookingFormValues): void => {
        const selectedSession = sessions?.find(
            (s) => s.id === values.sessionId
        );
        addBooking.mutate({
            sessionId: Number(values.sessionId),
            tuteeId: 2,
            tutorId: selectedSession?.tutorId ?? 1,
            status: BookingStatus.REQUESTED,
            requestedAt: new Date().toISOString(), // a STRING, not a Date
            note: values.note,
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

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Request a booking -- pick a session and tell the tutor what you need.
                </p>

                <div className="grid gap-1.5">
                    <Label htmlFor="sessionId" className="text-foreground">
                        Session
                    </Label>
                    <select
                        id="sessionId"
                        {...register("sessionId")}
                        className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
                    >
                        <option value="">Select a session...</option>
                        {(sessions ?? []).map((session) => (
                            <option key={session.id} value={session.id}>
                                {session.title}
                            </option>
                        ))}
                    </select>
                    {errors.sessionId && (
                        <p className="text-sm text-red-600">
                            {errors.sessionId.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="note" className="text-foreground">
                        What do you need help with?
                    </Label>
                    <Input
                        id="note"
                        {...register("note")}
                        aria-invalid={errors.note ? true : undefined}
                        placeholder="e.g. Please help me with limits and derivatives before the exam."
                    />
                    {errors.note && (
                        <p className="text-sm text-red-600">
                            {errors.note.message}
                        </p>
                    )}
                </div>

                {/* Never disabled on "invalid": clicking it is what shows the
                    error messages. Only a save in flight disables it. */}
                <Button
                    type="submit"
                    disabled={addBooking.isPending}
                    className="justify-self-start"
                >
                    {addBooking.isPending ? "Saving..." : "Add booking"}
                </Button>
                {addBooking.isError && addBooking.error && (
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {addBooking.error.message}
                    </p>
                )}
            </form>

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
