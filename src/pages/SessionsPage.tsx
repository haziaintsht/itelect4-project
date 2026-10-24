



import React, { useRef } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Crosshair, Search, SearchX } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchSessions } from "../api/client";
import type { ApiSession } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SessionsPage() {
    
    const searchTerm = useUiStore((state) => state.searchTerm);
    const setSearchTerm = useUiStore((state) => state.setSearchTerm);
    const previousSearch = usePrevious(searchTerm);
    const searchInputRef = useRef<HTMLInputElement>(null);

    
    const { data, isPending, isError, error } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const focusSearch = (): void => {
        searchInputRef.current?.focus();
    };

    const header = (
        <PageHeader
            eyebrow="Browse"
            title="Tutoring sessions"
            description="Find a session that matches what you're studying, then open it to meet the tutor and book."
        />
    );

    if (isPending) {
        return (
            <div className="space-y-8">
                {header}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-56 animate-pulse rounded-2xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                {header}
                <ErrorAlert message={error?.message ?? "Could not load sessions."} />
            </div>
        );
    }

    
    const filteredSessions = data.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {header}

            <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by title or subject..."
                            aria-label="Search sessions"
                            className="h-10 pl-9"
                        />
                    </div>
                    <Button variant="outline" className="h-10 px-3" onClick={focusSearch}>
                        <Crosshair />
                        Focus
                    </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>
                        Showing {filteredSessions.length} of {data.length} session(s)
                    </span>
                    <span>
                        {previousSearch !== undefined && previousSearch !== searchTerm
                            ? `Previous search: "${previousSearch}"`
                            : "Type to filter the list."}
                    </span>
                </div>
            </div>

            {filteredSessions.length === 0 ? (
                <EmptyState
                    icon={SearchX}
                    title="No sessions found"
                    description={
                        searchTerm
                            ? `Nothing matches "${searchTerm}". Try a different title or subject.`
                            : "There are no sessions yet. Check back soon."
                    }
                    action={
                        searchTerm ? (
                            <Button variant="outline" onClick={() => setSearchTerm("")}>
                                Clear search
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSessions.map((session) => (
                        <Link
                            key={session.id}
                            to={`/sessions/${session.id}`}
                            className="rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                        >
                            <ComplaintCard session={session} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SessionsPage;
