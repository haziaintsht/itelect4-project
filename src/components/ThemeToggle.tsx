



import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import useUiStore from "../store/uiStore";

function ThemeToggle() {
    const isDarkMode = useUiStore((state) => state.isDarkMode);
    const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const prefersLessMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        
        
        if (typeof document.startViewTransition !== "function" || prefersLessMotion) {
            toggleDarkMode();
            return;
        }

        
        
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX || rect.left + rect.width / 2;
        const y = e.clientY || rect.top + rect.height / 2;
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );
        const root = document.documentElement;
        root.style.setProperty("--reveal-x", `${x}px`);
        root.style.setProperty("--reveal-y", `${y}px`);
        root.style.setProperty("--reveal-r", `${radius}px`);

        
        
        
        document.startViewTransition(() => {
            flushSync(() => toggleDarkMode());
        });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-[29px] w-[54px] shrink-0 cursor-pointer items-center rounded-full border border-border bg-card p-[3px] transition-colors duration-300 hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
            <span
                className={`flex size-[21px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isDarkMode ? "translate-x-0" : "translate-x-[23px]"
                }`}
            >
                {isDarkMode ? <Moon className="size-3" /> : <Sun className="size-3" />}
            </span>
        </button>
    );
}

export default ThemeToggle;
