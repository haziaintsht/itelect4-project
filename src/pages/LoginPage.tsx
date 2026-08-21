// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

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
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
                onClick={handleLogin}
                disabled={name === ""}
                className="mt-3 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-400 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
            >
                Log In
            </button>
        </div>
    );
}

export default LoginPage;
