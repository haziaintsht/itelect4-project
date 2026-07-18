// ===== ENUMS =====
export enum ComplaintStatus {
    PENDING = "PENDING",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}

export const enum Role {
    Admin = "admin",
    Officer = "officer"
}

// ===== INTERFACES (The 3 Core Entities) =====
export interface User {
    id: number;
    name: string;
    email: string;
    role: Role; 
    isActive: boolean;
}

export interface Tricycle {
    id: number;
    plateNumber: string;
    operatorName: string;
    phoneNumber: string; // Used for SMS notifications
}

export interface Complaint {
    id: number;
    tricycleId: number;
    complainantName: string;
    issueDescription: string;
    status: ComplaintStatus;
    filedAt: Date;
}

// ===== TYPE ALIASES & UNIONS =====
export type ID = number | string;
export type StringOrNumber = string | number;

// ===== GENERIC INTERFACE (The Delivery Box) =====
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ===== UTILITY TYPES =====
// Partial - Perfect for updating a complaint's status or details
export type ComplaintUpdate = Partial<Complaint>;

// Omit - Strip out phone numbers/private info for a public view
export type PublicTricycleView = Omit<Tricycle, "phoneNumber">;

// Record - Dashboard-style stats
export type StatusCounts = Record<ComplaintStatus, number>;