// src/components/ComplaintCard.tsx
// SESSION 7: the data now arrives from json-server over HTTP, so the prop
// type says ApiSession (string id, ISO-string createdAt) instead of Session.
import React from "react";
import type { ApiSession } from "../types/index";

interface ComplaintCardProps {
    session: ApiSession;
    onSelect: (session: ApiSession) => void;
    variant?: "default" | "compact";
}

function ComplaintCard({ session, onSelect, variant = "default" }: ComplaintCardProps) {
    const isCompact = variant === "compact";
    return (
        <div className={`rounded-3xl border border-gray-200 bg-white shadow-xl shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none mb-4 ${isCompact ? "p-3" : "p-5"}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className={`font-semibold text-slate-900 dark:text-slate-100 ${isCompact ? "text-sm" : "text-base"}`}>{session.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {session.status}
                </span>
            </div>
            {!isCompact && (
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-300"><strong>Subject:</strong> {session.subject}</p>
            )}
            {!isCompact && (
                <p className="mb-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{session.description}</p>
            )}
            <button onClick={() => onSelect(session)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300">
                View Details
            </button>
        </div>
    );
}

export default ComplaintCard;