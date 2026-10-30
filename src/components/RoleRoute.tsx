import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import type { UserRole } from "../types/index";

function RoleRoute({ role }: { role: UserRole }) {
    const userRole = useAuthStore((state) => state.user?.role);

    if (userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RoleRoute;
