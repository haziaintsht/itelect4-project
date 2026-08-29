// src/components/StatusBadge.tsx
import React from "react";
import { BookingStatus } from "../types/index";

interface StatusBadgeProps {
    statusType: BookingStatus;
    children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, children }) => {
    return (
        <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            <strong className="mr-2">Status:</strong>
            {statusType}
            {children}
        </div>
    );
};

export default StatusBadge;