






import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "../types/index";


interface AuthState {
    token: string | null;
    user: AuthUser | null;
    setAuth: (auth: AuthResponse) => void;
    logout: () => void;
}



const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: ({ token, user }) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: "itelect4-auth", 
            partialize: (state) => ({
                
                token: state.token,
                user: state.user,
            }),
        }
    )
);

export default useAuthStore;
