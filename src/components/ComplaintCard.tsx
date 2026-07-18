// src/components/ComplaintCard.tsx
import React from "react";
import type { Complaint } from "../types/index";

interface ComplaintCardProps {
    complaint: Complaint;
    onSelect: (complaint: Complaint) => void;
}

function ComplaintCard({ complaint, onSelect }: ComplaintCardProps) {
    // Typed mouse event for clicking the action button
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        onSelect(complaint);
    };

    // Typed change event for inline logging / notes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log("Admin note update:", e.target.value);
    };

    return (
        <div className="complaint-card">
            <h3>Complaint #{complaint.id}</h3>
            <p><strong>Complainant:</strong> {complaint.complainantName}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            
            <button onClick={handleClick}>View Details</button>
            <input onChange={handleChange} placeholder="Add rapid note..." />
        </div>
    );
}

export default ComplaintCard;