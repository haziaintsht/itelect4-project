import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, CircleCheckBig, Inbox, LoaderCircle, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";
import useAuthStore from "../store/authStore";
import { deleteBooking, fetchBookings, updateBookingStatus } from "../api/client";
import { BookingStatus } from "../types/index";
import type { ApiBooking } from "../types/index";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const GROUPS = [
    {
        status: BookingStatus.REQUESTED,
        title: "New requests",
        empty: "No new requests right now.",
    },
    {
        status: BookingStatus.CONFIRMED,
        title: "Confirmed",
        empty: "Confirm a request and it moves here until the session is done.",
    },
    {
        status: BookingStatus.COMPLETED,
        title: "Completed",
        empty: "Sessions you mark as completed show up here.",
    },
];

function RequestsPage() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.user?.id);

    const { data: bookings, isPending, isError, error } = useQuery<ApiBooking[]>({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
    });

    const refresh = (): void => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
    };

    const changeStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
            updateBookingStatus(id, status),
        onSuccess: refresh,
    });

    const decline = useMutation({
        mutationFn: deleteBooking,
        onSuccess: refresh,
    });

    const header = (
        <PageHeader
            eyebrow="Tutor"
            title="Requests to you"
            description="Tutees ask for help on your sessions here. Confirm the ones you can take, then mark them completed after you meet."
        />
    );

    if (isPending) {
        return (
            <div className="space-y-8">
                {header}
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-48 animate-pulse rounded-2xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                {header}
                <ErrorAlert message={error.message || "Could not load requests."} />
            </div>
        );
    }

    const mine = bookings.filter((booking) => booking.tutor?.id === userId);
    const actionError = changeStatus.error ?? decline.error;

    const isBusy = (id: string): boolean =>
        (changeStatus.isPending && changeStatus.variables?.id === id) ||
        (decline.isPending && decline.variables === id);

    const handleDecline = (booking: ApiBooking): void => {
        const who = booking.tutee?.name ?? "this tutee";
        if (window.confirm(`Decline ${who}'s request? It will be removed.`)) {
            decline.mutate(booking.id);
        }
    };

    if (mine.length === 0) {
        return (
            <div className="space-y-8">
                {header}
                <EmptyState
                    icon={Inbox}
                    title="No requests yet"
                    description="When a tutee books one of your sessions, their request appears here."
                    action={
                        <Link to="/my-sessions" className={buttonVariants({ variant: "outline" })}>
                            Create a session
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {header}

            {actionError && <ErrorAlert message={actionError.message} />}

            {GROUPS.map(({ status, title, empty }) => {
                const group = mine.filter((booking) => booking.status === status);
                return (
                    <section key={status} className="space-y-4">
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-semibold text-foreground">{title}</h2>
                            <span className="text-sm text-muted-foreground">{group.length}</span>
                        </div>

                        {group.length === 0 ? (
                            <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                                {empty}
                            </p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {group.map((booking) => (
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
                                                <Avatar name={booking.tutee?.name ?? "?"} size="sm" />
                                                {booking.tutee ? booking.tutee.name : "Unknown tutee"}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="size-4" />
                                                {formatDate(booking.createdAt)}
                                            </span>
                                        </div>

                                        {status !== BookingStatus.COMPLETED && (
                                            <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                                                {status === BookingStatus.REQUESTED ? (
                                                    <>
                                                        <Button
                                                            className="h-9 px-3"
                                                            disabled={isBusy(booking.id)}
                                                            onClick={() =>
                                                                changeStatus.mutate({
                                                                    id: booking.id,
                                                                    status: BookingStatus.CONFIRMED,
                                                                })
                                                            }
                                                        >
                                                            {isBusy(booking.id) ? <LoaderCircle className="animate-spin" /> : <Check />}
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="h-9 px-3"
                                                            disabled={isBusy(booking.id)}
                                                            onClick={() => handleDecline(booking)}
                                                        >
                                                            <X />
                                                            Decline
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        className="h-9 px-3"
                                                        disabled={isBusy(booking.id)}
                                                        onClick={() =>
                                                            changeStatus.mutate({
                                                                id: booking.id,
                                                                status: BookingStatus.COMPLETED,
                                                            })
                                                        }
                                                    >
                                                        {isBusy(booking.id) ? <LoaderCircle className="animate-spin" /> : <CircleCheckBig />}
                                                        Mark completed
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}

export default RequestsPage;
