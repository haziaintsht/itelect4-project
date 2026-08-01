// src/components/UserCard.tsx
import React from "react";
import type { User } from "../types/index";

interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
    return (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", marginBottom: "10px", background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h3 style={{ margin: 0 }}>{user.name}</h3>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "5px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                    {user.role}
                </span>
            </div>
            <p style={{ margin: "0 0 6px", color: "#475569" }}><strong>Bio:</strong> {user.bio}</p>
            <p style={{ margin: "0 0 10px", color: "#475569" }}><strong>Skills:</strong> {user.skills.join(", ")}</p>
            <button onClick={() => onSelect(user)} style={{ border: "none", background: "#2563eb", color: "#fff", padding: "8px 12px", borderRadius: "10px", cursor: "pointer", fontWeight: 600 }}>
                View Tutor
            </button>
        </div>
    );
}

export default UserCard;