// src/components/ComplaintCard.tsx
import React from "react";
import type { Session } from "../types/index";

interface ComplaintCardProps {
    session: Session;
    onSelect: (session: Session) => void;
}

function ComplaintCard({ session, onSelect }: ComplaintCardProps) {
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px", marginBottom: "10px", background: "#fff" }}>
            <h3 style={{ margin: "0 0 6px" }}>{session.title}</h3>
            <p style={{ margin: "0 0 6px" }}><strong>Subject:</strong> {session.subject}</p>
            <p style={{ margin: "0 0 10px" }}><strong>Status:</strong> {session.status}</p>
            <button onClick={() => onSelect(session)}>View Details</button>
        </div>
    );
}

export default ComplaintCard;