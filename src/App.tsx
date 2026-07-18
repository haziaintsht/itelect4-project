// src/App.tsx
import React from "react";
import UserCard from "./components/Usercard";
import ComplaintCard from "./components/ComplaintCard";
import StatusBadge from "./components/StatusBadge";

// Split imports: types use 'import type', Enums are imported as runtime values!
import { Role, ComplaintStatus } from "./types/index";
import type { User, Complaint } from "./types/index";


const mockUser: User = {
    id: 1,
    name: "Lance Fedelicio",
    email: "lance@dlsl.edu.ph",
    role: Role.Admin, 
    isActive: true
};

const mockComplaint: Complaint = {
    id: 101,
    tricycleId: 1, // Required property from your database model
    complainantName: "Juan Dela Cruz",
    issueDescription: "Tricycle operating overcharge fee near LTO Lipa.",
    status: ComplaintStatus.PENDING, 
    filedAt: new Date()
};

// 2. Render the components on your dashboard screen
function App() {
    return (
        <div className="app" style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Complaint Impact Dashboard</h1>
            <hr />

            {/* Render the Interactive User Card */}
            <UserCard 
                user={mockUser} 
                onSelect={(u) => console.log("Selected Admin User Object:", u)} 
            />

            <br />

            {/* Render the Interactive Complaint Tracker Card */}
            <ComplaintCard 
                complaint={mockComplaint} 
                onSelect={(c) => console.log("Viewing full report details for ID:", c.id)} 
            />

            <br />

            {/* Render the Flexible Component with Custom UI Nesting (Children) */}
            <StatusBadge statusType={mockComplaint.status}>
                <p style={{ margin: "5px 0 0 0" }}>
                    Assigned to local traffic management unit for immediate review.
                </p>
            </StatusBadge>
        </div>
    );
}

export default App;