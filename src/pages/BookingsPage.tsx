import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, CalendarPlus, CircleCheck, Inbox, LoaderCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { fetchBookings, fetchSessions, createBooking } from "../api/client";
import { bookingSchema } from "../schemas/bookingSchema";
import type { BookingFormValues } from "../schemas/bookingSchema";
import type { ApiBooking, ApiSession } from "../types/index";

function BookingsPage() {
    const queryClient = useQueryClient();

    
    
    const [searchParams] = useSearchParams();
    const preselectedId = searchParams.get("session") ?? "";

    
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        mode: "onTouched",
        defaultValues: { sessionId: preselectedId, note: "" },
    });

    
    const { data: bookings, isPending, isError, error } = useQuery<ApiBooking[]>({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
    });

    
    const { data: sessions } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    
    
    useEffect(() => {
        if (preselectedId && sessions?.some((s) => s.id === preselectedId)) {
            setValue("sessionId", preselectedId);
        }
    }, [preselectedId, sessions, setValue]);

    
    const addBooking = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            reset(); 
        },
    });

    
    const onSubmit = (values: BookingFormValues): void => {
        addBooking.mutate({ session: values.sessionId, note: values.note });
    };

    const header = (
        <PageHeader
            eyebrow="My bookings"
            title="Your bookings"
            description="Request a session from a tutor, then follow it from requested to confirmed to completed."
        />
    );

    if (isPending) {
        return (
            <div className="space-y-8">
                {header}
                <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                    <div className="h-80 animate-pulse rounded-2xl bg-muted" />
                    <div className="h-48 animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                {header}
                <ErrorAlert message={error.message || "Could not load bookings."} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {header}

            <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24"
                >
                    <div>
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <CalendarPlus className="size-5 text-primary" />
                            Request a booking
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pick a session and tell the tutor what you need.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sessionId" className="text-foreground">
                            Session
                        </Label>
                        <select
                            id="sessionId"
                            {...register("sessionId")}
                            aria-invalid={errors.sessionId ? true : undefined}
                            className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
                        >
                            <option value="">Select a session...</option>
                            {(sessions ?? []).map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.title}
                                    {session.tutor ? ` (with ${session.tutor.name})` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.sessionId && (
                            <p className="text-sm text-destructive">{errors.sessionId.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note" className="text-foreground">
                            What do you need help with?
                        </Label>
                        <Input
                            id="note"
                            {...register("note")}
                            aria-invalid={errors.note ? true : undefined}
                            placeholder="e.g. Limits and derivatives before the exam."
                            className="h-10"
                        />
                        {errors.note ? (
                            <p className="text-sm text-destructive">{errors.note.message}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">10–160 characters.</p>
                        )}
                    </div>

                    {}
                    <Button
                        type="submit"
                        disabled={addBooking.isPending}
                        className="h-10 w-full"
                    >
                        {addBooking.isPending && <LoaderCircle className="animate-spin" />}
                        {addBooking.isPending ? "Saving..." : "Add booking"}
                    </Button>

                    {addBooking.isSuccess && (
                        <p className="flex items-center gap-2 text-sm text-primary">
                            <CircleCheck className="size-4" />
                            Booking requested! It is now in your list.
                        </p>
                    )}
                    {addBooking.isError && addBooking.error && (
                        <ErrorAlert message={addBooking.error.message} />
                    )}
                </form>

                <section className="space-y-4">
                    <div className="flex items-baseline justify-between">
                        <h2 className="font-semibold text-foreground">Requests</h2>
                        <span className="text-sm text-muted-foreground">
                            {bookings.length} total
                        </span>
                    </div>

                    {bookings.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title="No bookings yet"
                            description="Choose a session in the form to send your first request. It will show up here."
                            action={
                                <Link to="/sessions" className={buttonVariants({ variant: "outline" })}>
                                    Browse sessions
                                </Link>
                            }
                        />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            {bookings.map((booking) => (
                                <article
                                    key={booking.id}
                                    className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            {booking.session ? (
                                                <Link
                                                    to={`/sessions/${booking.session.id}`}
                                                    className="font-semibold text-foreground hover:text-primary"
                                                >
                                                    {booking.session.title}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold text-muted-foreground">
                                                    Deleted session
                                                </span>
                                            )}
                                            {booking.session && (
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.session.subject}
                                                </p>
                                            )}
                                        </div>
                                        <StatusBadge statusType={booking.status} />
                                    </div>

                                    <p className="mt-4 flex-1 rounded-xl bg-muted p-3 text-sm leading-6 text-foreground">
                                        “{booking.note}”
                                    </p>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <Avatar name={booking.tutor?.name ?? "?"} size="sm" />
                                            {booking.tutor ? booking.tutor.name : "Unknown tutor"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays className="size-4" />
                                            {formatDate(booking.createdAt)}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default BookingsPage;
