import { ArrowRight, BookOpen, User, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Avatar from "./Avatar";
import { SessionType } from "../types/index";
import type { ApiSession } from "../types/index";

interface SessionCardProps {
    session: ApiSession;
    onSelect?: (session: ApiSession) => void;
    variant?: "default" | "compact";
}

function SessionCard({ session, onSelect, variant = "default" }: SessionCardProps) {
    const isGroup = session.sessionType === SessionType.GROUP;
    const tutorName = session.tutor?.name ?? "Unknown tutor";

    if (variant === "compact") {
        return (
            <div
                onClick={() => onSelect?.(session)}
                className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
            >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <BookOpen className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground group-hover:text-primary">
                        {session.title}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                        {session.subject} · {tutorName}
                    </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
        );
    }

    return (
        <div
            onClick={() => onSelect?.(session)}
            className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
            <div className="flex items-center justify-between gap-3">
                <span className="truncate rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                    {session.subject}
                </span>
                <StatusBadge statusType={session.status} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary">
                {session.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
                {session.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                    <Avatar name={tutorName} size="sm" />
                    <span className="truncate text-foreground">{tutorName}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                    {isGroup ? <Users className="size-4" /> : <User className="size-4" />}
                    {isGroup ? "Group" : "One-on-one"}
                </span>
            </div>
        </div>
    );
}

export default SessionCard;
