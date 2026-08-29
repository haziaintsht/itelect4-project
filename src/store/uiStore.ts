// src/store/uiStore.ts
// Dark mode lived in Layout; the search term lived in SessionsPage.
// Neither belonged there -- both are settings ABOUT the whole app.
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
    isDarkMode: boolean;
    searchTerm: string;
    toggleDarkMode: () => void;
    setSearchTerm: (term: string) => void;
}

const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            isDarkMode: false,
            searchTerm: "",
            // set() takes a FUNCTION when the new value depends on the old one
            toggleDarkMode: () =>
                set((state) => ({ isDarkMode: !state.isDarkMode })),
            // the plain form, for when the new value does not depend on the old
            setSearchTerm: (term) => set({ searchTerm: term }),
        }),
        // Only the theme is worth remembering -- a search box still full of
        // old text after a reload would only confuse people.
        {
            name: "itelect4-ui",
            partialize: (state) => ({ isDarkMode: state.isDarkMode }),
        }
    )
);

export default useUiStore;
