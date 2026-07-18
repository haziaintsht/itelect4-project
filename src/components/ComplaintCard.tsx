// src/components/ComplaintCard.tsx
import React from "react";
import type { Session } from "../types/index";

interface ComplaintCardProps {
    session: Session;
    onSelect: (session: Session) => void;
}

function ComplaintCard({ session, onSelect }: ComplaintCardProps) {
    return (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px", marginBottom: "12px", background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{session.title}</h3>
                <span style={{ background: "#eff6ff", color: "#2563eb", padding: "6px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                    {session.status}
                </span>
            </div>
            <p style={{ margin: "0 0 8px", color: "#64748b" }}><strong>Subject:</strong> {session.subject}</p>
            <p style={{ margin: "0 0 12px", color: "#475569", lineHeight: 1.5 }}>{session.description}</p>
            <button onClick={() => onSelect(session)} style={{ border: "none", background: "#111827", color: "#fff", padding: "9px 12px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
                View Details
            </button>
        </div>
    );
}

export default ComplaintCard;