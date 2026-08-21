// src/components/Layout.tsx
import { NavLink, Outlet } from "react-router";
import useToggle from "../hooks/useToggle";
import useAuthStore from "../store/authStore";

function Layout() {
    // Dark mode lives here so every page inherits it
    const [isDarkMode, toggleDarkMode] = useToggle(false);
    const userName = useAuthStore((state) => state.userName);
    const logout = useAuthStore((state) => state.logout);

    // The classes every nav link shares, then the two variants
    const base = "rounded-full px-3 py-1.5 text-sm";
    const activeLink = `${base} bg-slate-900 font-semibold text-white dark:bg-slate-200 dark:text-slate-900`;
    const idleLink = `${base} text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700`;

    // NavLink hands this function an isActive flag on every render
    const linkClass = ({ isActive }: { isActive: boolean }): string =>
        isActive ? activeLink : idleLink;

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <nav className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <span className="mr-4 font-bold text-slate-900 dark:text-white">
                        Peer Tutoring
                    </span>
                    <NavLink to="/" end className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/sessions" className={linkClass}>
                        Sessions
                    </NavLink>
                    <NavLink to="/bookings" className={linkClass}>
                        Bookings
                    </NavLink>
                    {userName === null ? (
                        <NavLink to="/login" className={linkClass}>
                            Login
                        </NavLink>
                    ) : (
                        <button
                            onClick={logout}
                            className="rounded-full px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300"
                        >
                            Logout ({userName})
                        </button>
                    )}
                    <button
                        onClick={toggleDarkMode}
                        className="ml-auto rounded-full bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-slate-200 dark:text-slate-900"
                    >
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </nav>
                <main className="p-6">
                    <Outlet /> {/* <-- THE HOLE */}
                </main>
            </div>
        </div>
    );
}

export default Layout;
