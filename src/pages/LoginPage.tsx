import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, GraduationCap, LoaderCircle } from "lucide-react";
import useAuthStore from "../store/authStore";
import ErrorAlert from "../components/ErrorAlert";
import { login, register } from "../api/client";
import { UserRole } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

const ROLE_OPTIONS = [
    { value: UserRole.TUTEE, title: "Tutee", hint: "I want help", icon: BookOpen },
    { value: UserRole.TUTOR, title: "Tutor", hint: "I can teach", icon: GraduationCap },
];

function LoginPage() {
    const [mode, setMode] = useState<Mode>("login");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<UserRole>(UserRole.TUTEE);
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((state) => state.setAuth);

    const isRegister = mode === "register";

    const switchMode = (next: Mode): void => {
        setMode(next);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError("");
        setIsPending(true);
        try {
            const auth = isRegister
                ? await register(name, email, password, role)
                : await login(email, password);
            setAuth(auth);
            queryClient.removeQueries({ queryKey: ["bookings"] });
            navigate("/bookings");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Something went wrong. Try again."
            );
        } finally {
            setIsPending(false);
        }
    };

    const isIncomplete =
        email === "" || password === "" || (isRegister && name === "");

    const tabClass = (active: boolean): string =>
        cn(
            "rounded-md py-2 text-sm font-medium transition-colors",
            active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
        );

    return (
        <div className="mx-auto max-w-md py-4">
            <div className="mb-6 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <GraduationCap className="size-6" />
                </span>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                    {isRegister ? "Create your account" : "Welcome back"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {isRegister
                        ? "Join as a tutee to get help, or as a tutor to teach."
                        : "Log in to request and track your bookings."}
                </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div role="tablist" className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={!isRegister}
                        onClick={() => switchMode("login")}
                        className={tabClass(!isRegister)}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={isRegister}
                        onClick={() => switchMode("register")}
                        className={tabClass(isRegister)}
                    >
                        Register
                    </button>
                </div>

                {error && (
                    <div className="mb-5">
                        <ErrorAlert message={error} />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4">
                    {isRegister && (
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-foreground">
                                Full name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Juan Dela Cruz"
                                autoComplete="name"
                                className="h-10"
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@school.edu"
                            autoComplete="email"
                            className="h-10"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-foreground">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            minLength={isRegister ? 6 : undefined}
                            className="h-10"
                        />
                        {isRegister && (
                            <p className="text-xs text-muted-foreground">At least 6 characters.</p>
                        )}
                    </div>

                    {isRegister && (
                        <fieldset className="grid gap-2">
                            <legend className="mb-2 text-sm font-medium text-foreground">I am a...</legend>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLE_OPTIONS.map(({ value, title, hint, icon: Icon }) => {
                                    const selected = role === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => setRole(value)}
                                            className={cn(
                                                "rounded-xl border p-3 text-left transition-colors",
                                                selected
                                                    ? "border-primary bg-accent"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <Icon className={cn("size-5", selected ? "text-primary" : "text-muted-foreground")} />
                                            <span className="mt-2 block text-sm font-medium text-foreground">{title}</span>
                                            <span className="block text-xs text-muted-foreground">{hint}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </fieldset>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending || isIncomplete}
                        className="mt-2 h-10 w-full"
                    >
                        {isPending && <LoaderCircle className="animate-spin" />}
                        {isPending
                            ? isRegister ? "Creating account..." : "Signing in..."
                            : isRegister ? "Create account" : "Log in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
