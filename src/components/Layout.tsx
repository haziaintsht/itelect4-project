




import { useLayoutEffect } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
    BookOpen,
    CalendarCheck,
    GraduationCap,
    LayoutDashboard,
    LogIn,
    LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/sessions", label: "Sessions", icon: BookOpen, end: false },
    { to: "/bookings", label: "Bookings", icon: CalendarCheck, end: false },
];

function Layout() {
    const isDarkMode = useUiStore((state) => state.isDarkMode);
    const userName = useAuthStore((state) => state.user?.name ?? null);
    const logout = useAuthStore((state) => state.logout);

    
    
    
    useLayoutEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    
    const linkClass = ({ isActive }: { isActive: boolean }): string =>
        cn(
            "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        );

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
                    <Link to="/" className="flex items-center gap-2.5 font-semibold text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <GraduationCap className="size-5" />
                        </span>
                        Peer Tutoring
                    </Link>

                    {}
                    <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-2 md:w-auto">
                        {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                            <NavLink key={to} to={to} end={end} className={linkClass}>
                                <Icon className="size-4" />
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="order-2 ml-auto flex items-center gap-3 md:order-3">
                        <ThemeToggle />
                        {userName === null ? (
                            <Link to="/login" className={buttonVariants({ size: "sm" })}>
                                <LogIn />
                                Log in
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Avatar name={userName} size="sm" />
                                <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:inline">
                                    {userName}
                                </span>
                                <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
                                    <LogOut />
                                    <span className="hidden sm:inline">Log out</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
                <Outlet /> {}
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
                    <span>© {new Date().getFullYear()} Peer Tutoring · ITELECT4</span>
                    <span>Learn together, one session at a time.</span>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
