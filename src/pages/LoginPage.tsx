// src/pages/LoginPage.tsx
// SESSION 10: a real email + password, checked by the backend. The same
// page registers a new account: /api/auth/register answers with a token
// too, so a new user is logged in the moment the account exists. Either
// way the JWT and profile go into authStore and the user lands on
// /bookings.
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import { login, register } from "../api/client";
import { UserRole } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

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

    const switchMode = (): void => {
        setMode(isRegister ? "login" : "register");
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
            // A different person may have been logged in before -- their
            // bookings must not flash up while this user's load.
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

    return (
        <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-slate-100">
                {isRegister ? "Create an account" : "Login"}
            </h2>
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-3">
                {isRegister && (
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-foreground">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Juan Dela Cruz"
                        />
                    </div>
                )}
                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-foreground">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.edu"
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="password" className="text-foreground">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        // The User schema's minlength -- the browser says so
                        // before the server has to.
                        minLength={isRegister ? 6 : undefined}
                    />
                    {isRegister && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            At least 6 characters.
                        </p>
                    )}
                </div>
                {isRegister && (
                    <div className="grid gap-1.5">
                        <Label htmlFor="role" className="text-foreground">
                            I am a
                        </Label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                        >
                            <option value={UserRole.TUTEE}>Tutee -- I want help</option>
                            <option value={UserRole.TUTOR}>Tutor -- I teach</option>
                        </select>
                    </div>
                )}
                <Button
                    type="submit"
                    disabled={isPending || isIncomplete}
                    className="mt-2 w-full"
                >
                    {isPending
                        ? isRegister ? "Creating account..." : "Signing in..."
                        : isRegister ? "Register" : "Log In"}
                </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                {isRegister ? "Already have an account?" : "No account yet?"}{" "}
                <button
                    type="button"
                    onClick={switchMode}
                    className="font-semibold text-slate-900 underline dark:text-slate-100"
                >
                    {isRegister ? "Log in" : "Register"}
                </button>
            </p>
        </div>
    );
}

export default LoginPage;
