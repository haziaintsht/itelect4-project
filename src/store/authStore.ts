// src/store/authStore.ts
// The nav bar has to know whether anyone is logged in. A store is a box
// any component can read from, without passing props down.
// SESSION 10: login now hits the real backend (/api/auth/login) and stores
// the signed JWT. ProtectedRoute checks the token is not null.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, register } from "../api/client";

// The shape of the store: its data AND the functions that change it
interface AuthState {
    token: string | null;
    user: { id: string; name: string; email: string; role: string } | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
}

// Note the extra (): with middleware, TypeScript needs the empty call
// first or the generic stops working.
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            login: async (email, password) => {
                const { token, user } = await login(email, password);
                set({ token, user });
            },
            register: async (name, email, password, role) => {
                const { token, user } = await register(name, email, password, role);
                set({ token, user });
            },
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: "itelect4-auth", // the localStorage key it writes to
            partialize: (state) => ({
                // save ONLY these two fields -- functions cannot become JSON
                token: state.token,
                user: state.user,
            }),
        }
    )
);

export default useAuthStore;

