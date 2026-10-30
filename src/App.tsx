import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MySessionsPage from "./pages/MySessionsPage";
import NotFoundPage from "./pages/NotFoundPage";
import RequestsPage from "./pages/RequestsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import SessionsPage from "./pages/SessionsPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import { UserRole } from "./types/index";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="sessions" element={<SessionsPage />} />
                <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<RoleRoute role={UserRole.TUTEE} />}>
                        <Route path="bookings" element={<BookingsPage />} />
                        <Route path="study-plan" element={<StudyPlanPage />} />
                    </Route>
                    <Route element={<RoleRoute role={UserRole.TUTOR} />}>
                        <Route path="requests" element={<RequestsPage />} />
                        <Route path="my-sessions" element={<MySessionsPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
