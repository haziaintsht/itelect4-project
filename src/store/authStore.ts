// src/store/authStore.ts
// The nav bar has to know whether anyone is logged in. A store is a box
// any component can read from, without passing props down.
// SESSION 7: wrapped in persist() so a refresh no longer logs you out.
import { create } from "zustand";
import { persist } from "zustand/middleware";

// The shape of the store: its data AND the functions that change it
interface AuthState {
    token: string | null;
    userName: string | null;
    login: (name: string) => void;
    logout: () => void;
}

// Note the extra (): with middleware, TypeScript needs the empty call
// first or the generic stops working.
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            userName: null,
            login: (name) => set({ token: `demo-token-${name}`, userName: name }),
            logout: () => set({ token: null, userName: null }),
        }),
        {
            name: "itelect4-auth", // the localStorage key it writes to
            partialize: (state) => ({
                // save ONLY these two fields -- functions cannot become JSON
                token: state.token,
                userName: state.userName,
            }),
        }
    )
);

export default useAuthStore;

