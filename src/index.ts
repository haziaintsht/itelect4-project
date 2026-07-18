import type { 
    User, 
    Tricycle, 
    Complaint, 
    StringOrNumber, 
    ApiResponse,
    ComplaintUpdate, 
    PublicTricycleView, 
    StatusCounts 
} from "./types/index";

import { ComplaintStatus, Role } from "./types/index";

// ===== PRIMITIVE TYPE ANNOTATIONS =====
const projectName: string = "Complaint Impact";
const currentYear: number = 2026;
const isFullStack: boolean = true;

function greetProject(name: string, year: number): string {
    return `Welcome to ${name} Workspace -- AY ${year}!`;
}
console.log(greetProject(projectName, currentYear));

// ===== SAMPLE DATA =====
const officer: User = {
    id: 1,
    name: "Lance Fedelicio",
    email: "lance@example.com",
    role: Role.Admin,
    isActive: true,
};

const tricycleRecord: Tricycle = {
    id: 101,
    plateNumber: "LP-1234",
    operatorName: "Juan dela Cruz",
    phoneNumber: "09171234567"
};

const activeComplaint: Complaint = {
    id: 995,
    tricycleId: 101,
    complainantName: "Maria Santos",
    issueDescription: "Overcharging fare beyond standard city matrices.",
    status: ComplaintStatus.PENDING,
    filedAt: new Date()
};

// ===== GENERIC FUNCTIONS =====
// Safe lookups for any entity array containing an ID
function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

const foundTricycle = getById<Tricycle>([tricycleRecord], 101);
console.log(`Found Tricycle Operator: ${foundTricycle?.operatorName}`);

// ===== GENERIC API RESPONSE =====
const complaintResponse: ApiResponse<Complaint> = {
    success: true,
    message: "Complaint details loaded.",
    data: activeComplaint
};
console.log(`Complaint Issue: ${complaintResponse.data.issueDescription}`);

// ===== USING UTILITY TYPES =====
// 1. Partial: Modifying complaint status
const updatePayload: ComplaintUpdate = { status: ComplaintStatus.RESOLVED };

// 2. Omit: Showing safe public tricycle data
const publicView: PublicTricycleView = {
    id: 101,
    plateNumber: "LP-1234",
    operatorName: "Juan dela Cruz"
};

// 3. Record: Dashboard widget analytics
const counts: StatusCounts = {
    [ComplaintStatus.PENDING]: 12,
    [ComplaintStatus.RESOLVED]: 45,
    [ComplaintStatus.REJECTED]: 3
};

// ===== ReturnType =====
function generateSMSNotice(operatorName: string, plate: string) {
    return {
        recipient: operatorName,
        message: `Notice: A complaint has been logged against tricycle ${plate}. Please report to the office.`,
        sentAt: new Date()
    };
}

type SMSPayload = ReturnType<typeof generateSMSNotice>;
const notification: SMSPayload = generateSMSNotice(tricycleRecord.operatorName, tricycleRecord.plateNumber);
console.log("Generated Notice:", notification.message);