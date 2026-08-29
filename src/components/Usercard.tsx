// src/components/UserCard.tsx
import React from "react";
import type { User } from "../types/index";

interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-slate-800 dark:border-slate-700 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {user.role}
                </span>
            </div>
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-300"><strong>Bio:</strong> {user.bio}</p>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300"><strong>Skills:</strong> {user.skills.join(", ")}</p>
            <button onClick={() => onSelect(user)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300">
                View Tutor
            </button>
        </div>
    );
}

export default UserCard;