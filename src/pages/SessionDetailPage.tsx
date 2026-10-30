import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, CalendarPlus, Sparkles, User, Users, Video } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import UserCard from "../components/UserCard";
import ErrorAlert from "../components/ErrorAlert";
import { fetchSessionById, fetchBookings } from "../api/client";
import useAuthStore from "../store/authStore";
import { SessionType, UserRole } from "../types/index";
import type { ApiSession, ApiBooking, User as UserType } from "../types/index";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

function SessionDetailPage() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const token = useAuthStore((state) => state.token);

    const {
        data: session,
        isPending,
        isError,
        error,
    } = useQuery<ApiSession>({
        queryKey: ["sessions", sessionId],
        queryFn: () => fetchSessionById(sessionId!),
        enabled: sessionId !== undefined,
    });

    const { data: allBookings } = useQuery<ApiBooking[]>({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
        enabled: token !== null,
    });

    const booking = (allBookings ?? []).find(
        (b) => b.session?.id === session?.id
    );

    const tutor = useMemo<UserType | undefined>(
        () =>
            session?.tutor
                ? {
                      id: session.tutor.id,
                      name: session.tutor.name,
                      email: session.tutor.email,
                      role: UserRole.TUTOR,
                      bio: `Runs "${session.title}".`,
                      skills: [session.subject],
                      isActive: true,
                  }
                : undefined,
        [session]
    );

    const backLink = (
        <Link to="/sessions" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}>
            <ArrowLeft />
            Back to sessions
        </Link>
    );

    if (isPending) {
        return (
            <div className="space-y-6">
                {backLink}
                <div className="h-64 animate-pulse rounded-3xl bg-muted" />
            </div>
        );
    }

    if (isError || session === undefined) {
        return (
            <div className="space-y-6">
                {backLink}
                <ErrorAlert message={error?.message ?? `No session found with id "${sessionId}".`} />
            </div>
        );
    }

    const isGroup = session.sessionType === SessionType.GROUP;
    const tutorFirstName = tutor?.name.split(" ")[0] ?? "the tutor";

    return (
        <div className="space-y-6">
            {backLink}

            <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                        {session.subject}
                    </span>
                    <StatusBadge statusType={session.status} />
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                    {session.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        {isGroup ? <Users className="size-4" /> : <User className="size-4" />}
                        {isGroup ? "Group session" : "One-on-one"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        Posted {formatDate(session.createdAt)}
                    </span>
                    {session.meetingLink && (
                        <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:underline"
                        >
                            <Video className="size-4" />
                            Meeting link
                        </a>
                    )}
                </div>
                <p className="mt-6 max-w-3xl leading-7 text-foreground/90">{session.description}</p>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {booking ? (
                        <section className="rounded-2xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-semibold text-foreground">Your booking</h2>
                                <StatusBadge statusType={booking.status} />
                            </div>
                            <p className="mt-3 rounded-xl bg-muted p-3 text-sm leading-6 text-foreground">
                                “{booking.note}”
                            </p>
                            <Link to="/bookings" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                                See all my bookings
                            </Link>
                        </section>
                    ) : (
                        <section className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-foreground">Want help with this?</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Send {tutorFirstName} a booking request. It only takes a minute.
                                </p>
                            </div>
                            <Link
                                to={`/bookings?session=${session.id}`}
                                className={cn(buttonVariants(), "h-10 shrink-0 px-4")}
                            >
                                <CalendarPlus />
                                Book this session
                            </Link>
                        </section>
                    )}

                    <section className="rounded-2xl border border-primary/25 bg-accent p-6">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Sparkles className="size-4" />
                            Not sure where to start?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                            Describe what you are stuck on and the Study Planner will suggest
                            the topics to focus on first.
                        </p>
                        <Link to="/study-plan" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                            Open the Study Planner
                        </Link>
                    </section>
                </div>

                {tutor && (
                    <aside className="space-y-3 self-start">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Your tutor
                        </h2>
                        <UserCard user={tutor} />
                    </aside>
                )}
            </div>
        </div>
    );
}

export default SessionDetailPage;
