// src/pages/LoginPage.tsx
// SESSION 8: the UI now uses the shadcn Button/Input/Label components.
// It keeps useState on purpose -- one field with one rule does not need
// a schema, and knowing when to stop is half the skill.
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const [name, setName] = useState<string>("");
    // Pull just the login action out of the store
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = (): void => {
        login(name); // 1. put the token in the store
        navigate("/bookings"); // 2. then send them where they were going
    };

    return (
        <div className="mx-auto max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-slate-100">Login</h2>
            <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-foreground">
                    Your name
                </Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan dela Cruz"
                />
            </div>
            <Button onClick={handleLogin} disabled={name === ""} className="mt-3 w-full">
                Log In
            </Button>
        </div>
    );
}

export default LoginPage;
