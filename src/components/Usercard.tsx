// src/components/UserCard.tsx
import React from "react";
import type { User } from "../types/index";

interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
    return (
        <div style={{ border: "1px solid #d1d5db", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
            <h3 style={{ margin: "0 0 6px" }}>{user.name}</h3>
            <p style={{ margin: "0 0 6px" }}><strong>Role:</strong> {user.role}</p>
            <p style={{ margin: "0 0 6px" }}><strong>Bio:</strong> {user.bio}</p>
            <p style={{ margin: "0 0 10px" }}><strong>Skills:</strong> {user.skills.join(", ")}</p>
            <button onClick={() => onSelect(user)}>View Tutor</button>
        </div>
    );
}

export default UserCard;