// src/components/ProtectedRoute.tsx
// It renders no UI of its own -- it only decides whether to let a
// child route through or redirect to login.
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
    const token = useAuthStore((state) => state.token);

    // No token? Send them to the login page instead of the page they
    // asked for.
    if (token === null) {
        return <Navigate to="/login" replace />;
    }

    // There IS a token, so render whichever child route matched.
    return <Outlet />;
}

export default ProtectedRoute;
