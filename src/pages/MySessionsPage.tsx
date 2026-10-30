import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Plus, Presentation } from "lucide-react";
import SessionCard from "../components/SessionCard";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import useAuthStore from "../store/authStore";
import { createSession, fetchSessions } from "../api/client";
import { sessionSchema } from "../schemas/sessionSchema";
import type { SessionFormValues } from "../schemas/sessionSchema";
import { SessionType } from "../types/index";
import type { ApiSession } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_FORM: SessionFormValues = {
    title: "",
    subject: "",
    description: "",
    sessionType: SessionType.ONE_ON_ONE,
    meetingLink: "",
};

function MySessionsPage() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.user?.id);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        mode: "onTouched",
        defaultValues: EMPTY_FORM,
    });

    const { data: sessions, isPending, isError, error } = useQuery<ApiSession[]>({
        queryKey: ["sessions"],
        queryFn: fetchSessions,
    });

    const addSession = useMutation({
        mutationFn: createSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
            reset(EMPTY_FORM);
        },
    });

    const mine = (sessions ?? []).filter((session) => session.tutor?.id === userId);

    const fieldError = (message?: string) =>
        message && <p className="text-sm text-destructive">{message}</p>;

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Tutor"
                title="My sessions"
                description="Create the sessions you teach. Tutees find them on the Sessions page and send you booking requests."
            />

            <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
                <form
                    onSubmit={handleSubmit((values) => addSession.mutate(values))}
                    className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24"
                >
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Plus className="size-5 text-primary" />
                        New session
                    </h2>

                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-foreground">Title</Label>
                        <Input
                            id="title"
                            {...register("title")}
                            aria-invalid={errors.title ? true : undefined}
                            placeholder="e.g. Recursion Made Simple"
                            className="h-10"
                        />
                        {fieldError(errors.title?.message)}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="subject" className="text-foreground">Subject</Label>
                        <Input
                            id="subject"
                            {...register("subject")}
                            aria-invalid={errors.subject ? true : undefined}
                            placeholder="e.g. Programming"
                            className="h-10"
                        />
                        {fieldError(errors.subject?.message)}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            {...register("description")}
                            aria-invalid={errors.description ? true : undefined}
                            placeholder="What you will cover and who it is for."
                        />
                        {fieldError(errors.description?.message)}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sessionType" className="text-foreground">Type</Label>
                        <select
                            id="sessionType"
                            {...register("sessionType")}
                            className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                        >
                            <option value={SessionType.ONE_ON_ONE}>One-on-one</option>
                            <option value={SessionType.GROUP}>Group</option>
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meetingLink" className="text-foreground">
                            Meeting link <span className="font-normal text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="meetingLink"
                            {...register("meetingLink")}
                            aria-invalid={errors.meetingLink ? true : undefined}
                            placeholder="https://meet.google.com/..."
                            className="h-10"
                        />
                        {fieldError(errors.meetingLink?.message)}
                    </div>

                    <Button type="submit" disabled={addSession.isPending} className="h-10 w-full">
                        {addSession.isPending && <LoaderCircle className="animate-spin" />}
                        {addSession.isPending ? "Creating..." : "Create session"}
                    </Button>

                    {addSession.isSuccess && (
                        <p className="flex items-center gap-2 text-sm text-primary">
                            <CircleCheck className="size-4" />
                            Session created! Tutees can book it now.
                        </p>
                    )}
                    {addSession.isError && <ErrorAlert message={addSession.error.message} />}
                </form>

                <section className="space-y-4">
                    <div className="flex items-baseline justify-between">
                        <h2 className="font-semibold text-foreground">Sessions you teach</h2>
                        <span className="text-sm text-muted-foreground">{mine.length} total</span>
                    </div>

                    {isPending ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2].map((n) => (
                                <div key={n} className="h-56 animate-pulse rounded-2xl bg-muted" />
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorAlert message={error.message || "Could not load sessions."} />
                    ) : mine.length === 0 ? (
                        <EmptyState
                            icon={Presentation}
                            title="No sessions yet"
                            description="Fill in the form to create your first session. It will show up here and on the Sessions page."
                        />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {mine.map((session) => (
                                <Link
                                    key={session.id}
                                    to={`/sessions/${session.id}`}
                                    className="rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                                >
                                    <SessionCard session={session} />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default MySessionsPage;
