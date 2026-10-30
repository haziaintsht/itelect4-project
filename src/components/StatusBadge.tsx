import React from "react";
import { BookingStatus } from "../types/index";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    statusType: BookingStatus;
    children?: React.ReactNode;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
    [BookingStatus.REQUESTED]:
        "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400",
    [BookingStatus.CONFIRMED]: "bg-accent text-primary ring-primary/25",
    [BookingStatus.COMPLETED]:
        "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-400",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, children }) => {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                STATUS_STYLES[statusType]
            )}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {statusType}
            {children}
        </span>
    );
};

export default StatusBadge;
