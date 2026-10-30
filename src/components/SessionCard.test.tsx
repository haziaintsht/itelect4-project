import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SessionCard from "./SessionCard";
import { BookingStatus, SessionType } from "../types/index";
import type { ApiSession } from "../types/index";

const session: ApiSession = {
    id: "665f1c2ab4e8d3a1f0c9e101",
    title: "Calculus Crash Course",
    subject: "Calculus",
    description: "Review limits and derivatives before finals week.",
    status: BookingStatus.CONFIRMED,
    sessionType: SessionType.ONE_ON_ONE,
    meetingLink: "",
    createdAt: "2026-10-17T02:15:00.000Z",
    tutor: { id: "665f1c2ab4e8d3a1f0c9e001", name: "Mina Santos", email: "mina@example.com" },
};

describe("SessionCard", () => {
    it("shows the session's title, subject, status and tutor", () => {
        render(<SessionCard session={session} />);

        expect(screen.getByText("Calculus Crash Course")).toBeInTheDocument();
        expect(screen.getByText("Calculus")).toBeInTheDocument();
        expect(screen.getByText("confirmed")).toBeInTheDocument();
        expect(screen.getByText("Mina Santos")).toBeInTheDocument();
    });

    it("labels a one-on-one session and a group session differently", () => {
        const { rerender } = render(<SessionCard session={session} />);
        expect(screen.getByText("One-on-one")).toBeInTheDocument();

        rerender(<SessionCard session={{ ...session, sessionType: SessionType.GROUP }} />);
        expect(screen.getByText("Group")).toBeInTheDocument();
        expect(screen.queryByText("One-on-one")).not.toBeInTheDocument();
    });

    it("says Unknown tutor when the tutor account no longer exists", () => {
        render(<SessionCard session={{ ...session, tutor: null }} />);

        expect(screen.getByText("Unknown tutor")).toBeInTheDocument();
    });

    it("shows the subject and tutor on one line in the compact variant", () => {
        render(<SessionCard session={session} variant="compact" />);

        expect(screen.getByText("Calculus · Mina Santos")).toBeInTheDocument();
    });
});
