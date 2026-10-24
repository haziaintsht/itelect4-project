import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, BookOpen, CalendarCheck, Search, Send, Users } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import UserCard from "../components/Usercard";
import EmptyState from "../components/EmptyState";
import useToggle from "../hooks/useToggle";
import useAuthStore from "../store/authStore";
import { fetchSessions } from "../api/client";
import { UserRole } from "../types/index";
import type { ApiSession, User } from "../types/index";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
    { icon: Search, title: "Find a session", text: "Browse sessions by title or subject." },
    { icon: Send, title: "Request a booking", text: "Tell the tutor what you need help with." },
    { icon: CalendarCheck, title: "Learn together", text: "Track it from requested to completed." },
];

function DashboardPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetails, toggleDetails] = useToggle(false);
    const [liveCount, setLiveCount] = useState<number>(2);
    const userName = useAuthStore((state) => state.user?.name ?? null);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setLiveCount((value) => value + 1);
        }, 4000);

        return () => window.clearInterval(interval);
    }, []);

    const { data: sessions, isPending } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    const tutors = useMemo(() => {
        const byId = new Map<string, User>();
        const sessionCount = new Map<string, number>();
        for (const session of sessions ?? []) {
            const t = session.tutor;
            if (!t) continue;
            const tutor = byId.get(t.id) ?? {
                id: t.id,
                name: t.name,
                email: t.email,
                role: UserRole.TUTOR,
                bio: "",
                skills: [],
                isActive: true,
            };
            if (!tutor.skills.includes(session.subject)) {
                tutor.skills.push(session.subject);
            }
            byId.set(t.id, tutor);
            sessionCount.set(t.id, (sessionCount.get(t.id) ?? 0) + 1);
        }
        return [...byId.values()].map((tutor) => {
            const count = sessionCount.get(tutor.id) ?? 0;
            return { ...tutor, bio: `Teaches ${count} session${count === 1 ? "" : "s"} here.` };
        });
    }, [sessions]);

    const stats = [
        { label: "Sessions available", value: sessions?.length ?? 0, hint: "Open for booking", icon: BookOpen, live: false },
        { label: "Tutors", value: tutors.length, hint: "Peers ready to help", icon: Users, live: false },
        { label: "Live activity", value: liveCount, hint: "New tutor requests", icon: Activity, live: true },
    ];

    const firstName = userName?.split(" ")[0];

    return (
        <div className="space-y-10">
            {}
            <section className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Peer tutoring platform
                </p>
                <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {firstName ? `Welcome back, ${firstName}!` : "Learn it faster with a peer tutor."}
                </h1>
                <p className="mt-3 max-w-xl text-muted-foreground">
                    Browse sessions run by fellow students, send a booking request, and
                    follow it from requested to completed.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/sessions" className={cn(buttonVariants(), "h-10 px-4")}>
                        Browse sessions
                        <ArrowRight />
                    </Link>
                    <Link
                        to={userName ? "/bookings" : "/login"}
                        className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}
                    >
                        {userName ? "My bookings" : "Log in or register"}
                    </Link>
                </div>
            </section>

            {}
            <section className="grid gap-4 sm:grid-cols-3">
                {stats.map(({ label, value, hint, icon: Icon, live }) => (
                    <div key={label} className="rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">{label}</p>
                            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                                <Icon className="size-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-3xl font-bold text-foreground">
                            {isPending && !live ? "–" : value}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            {live && (
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                                </span>
                            )}
                            {hint}
                        </p>
                    </div>
                ))}
            </section>

            {}
            <section className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Latest sessions</h2>
                        <Link to="/sessions" className="text-sm font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {isPending ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-[74px] animate-pulse rounded-xl bg-muted" />
                            ))}
                        </div>
                    ) : (sessions ?? []).length === 0 ? (
                        <EmptyState icon={BookOpen} title="No sessions yet" description="Sessions will appear here once tutors add them." />
                    ) : (
                        <div className="space-y-3">
                            {(sessions ?? []).slice(0, 3).map((session) => (
                                <Link key={session.id} to={`/sessions/${session.id}`} className="block rounded-xl">
                                    <ComplaintCard session={session} variant="compact" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <h2 className="font-semibold text-foreground">How it works</h2>
                    <ol className="mt-5 space-y-5">
                        {STEPS.map(({ icon: Icon, title, text }, index) => (
                            <li key={title} className="flex gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                                    <Icon className="size-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {index + 1}. {title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Tutors</h2>
                        <p className="text-sm text-muted-foreground">
                            Pick a tutor, then show their details.
                        </p>
                    </div>
                    <Button variant="outline" onClick={toggleDetails}>
                        {showDetails ? "Hide" : "Show"} details
                    </Button>
                </div>

                {showDetails && (
                    <div className="rounded-xl border border-primary/25 bg-accent p-4 text-sm text-foreground">
                        {selectedUser !== null
                            ? `Selected: ${selectedUser.name} (${selectedUser.role}) · ${selectedUser.email} · teaches ${selectedUser.skills.join(", ")}`
                            : "No tutor selected yet -- press \"View tutor\" on a card."}
                    </div>
                )}

                {tutors.length === 0 && !isPending ? (
                    <EmptyState icon={Users} title="No tutors yet" description="Tutors appear here once they have a session." />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tutors.map((tutor) => (
                            <UserCard
                                key={tutor.id}
                                user={tutor}
                                onSelect={setSelectedUser}
                                isSelected={selectedUser?.id === tutor.id}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default DashboardPage;
