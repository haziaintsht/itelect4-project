// src/components/StatusBadge.tsx
import React from "react";
import { BookingStatus } from "../types/index";

interface StatusBadgeProps {
    statusType: BookingStatus;
    children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, children }) => {
    return (
        <div style={{ padding: "8px 10px", borderRadius: "999px", background: "#eef2ff", color: "#4338ca", display: "inline-block", marginTop: "8px" }}>
            <strong>Status: </strong>
            {statusType}
            {children}
        </div>
    );
};

export default StatusBadge;