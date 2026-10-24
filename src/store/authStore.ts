// src/store/authStore.ts
// The nav bar has to know whether anyone is logged in. A store is a box
// any component can read from, without passing props down.
// SESSION 10: the token is a real JWT, signed by /api/auth/login or
// /api/auth/register. The store only HOLDS it -- the calls themselves
// live in api/client.ts, which reads the token from here to build the
// Authorization header. ProtectedRoute still checks it is not null.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "../types/index";

// The shape of the store: its data AND the functions that change it
interface AuthState {
    token: string | null;
    user: AuthUser | null;
    setAuth: (auth: AuthResponse) => void;
    logout: () => void;
}

// Note the extra (): with middleware, TypeScript needs the empty call
// first or the generic stops working.
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: ({ token, user }) => set({ token, user }),
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
