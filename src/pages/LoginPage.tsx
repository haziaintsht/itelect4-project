// src/pages/LoginPage.tsx
// SESSION 10: real email/password login against the backend API.
// On success, the JWT and user profile are stored in authStore and the
// user is redirected to /bookings.
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { login } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);
    const navigate = useNavigate();
    const loginAction = useAuthStore((state) => state.login);

    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError("");
        setIsPending(true);
        try {
            await loginAction(email, password);
            navigate("/bookings");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Login failed. Try again."
            );
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-slate-100">Login</h2>
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                    {error}
                </div>
            )}
            <form onSubmit={handleLogin} className="grid gap-1.5">
                <div>
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
                <div>
                    <Label htmlFor="password" className="text-foreground">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isPending || email === "" || password === ""}
                    className="mt-3 w-full"
                >
                    {isPending ? "Signing in..." : "Log In"}
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
