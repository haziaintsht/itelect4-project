import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudyPlanPage from "./StudyPlanPage";

const SHORT_MESSAGE = "Write at least 20 characters so the planner has enough to work with.";
const LABEL = "What are you studying, and where are you stuck?";
const SUBMIT = "Make my study plan";

function renderStudyPlanPage() {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <StudyPlanPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("StudyPlanPage", () => {
    it("shows the schema message and sends nothing when the prompt is too short", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        const user = userEvent.setup();
        renderStudyPlanPage();

        await user.type(screen.getByLabelText(LABEL), "Too short");
        await user.click(screen.getByRole("button", { name: SUBMIT }));

        expect(await screen.findByText(SHORT_MESSAGE)).toBeInTheDocument();
        expect(screen.getByText("9/2000")).toBeInTheDocument();
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("shows every field of the study plan the API returns", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({
                    summary: "You are stuck on the chain rule.",
                    focusTopics: ["Chain rule", "Inner and outer functions"],
                    level: "intermediate",
                    suggestedSubject: "Calculus",
                })
            )
        );
        const user = userEvent.setup();
        renderStudyPlanPage();

        await user.type(
            screen.getByLabelText(LABEL),
            "I keep getting derivatives wrong before my exam."
        );
        await user.click(screen.getByRole("button", { name: SUBMIT }));

        expect(await screen.findByText("You are stuck on the chain rule.")).toBeInTheDocument();
        expect(screen.getByText("Chain rule")).toBeInTheDocument();
        expect(screen.getByText("Inner and outer functions")).toBeInTheDocument();
        expect(screen.getByText("intermediate")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Find Calculus sessions" })).toBeInTheDocument();
    });

    it("shows the API's message when the request is refused", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(
                JSON.stringify({ message: "Too many study plan requests. Wait a minute and try again." }),
                { status: 429 }
            )
        );
        const user = userEvent.setup();
        renderStudyPlanPage();

        await user.type(
            screen.getByLabelText(LABEL),
            "I keep getting derivatives wrong before my exam."
        );
        await user.click(screen.getByRole("button", { name: SUBMIT }));

        expect(
            await screen.findByText("Too many study plan requests. Wait a minute and try again.")
        ).toBeInTheDocument();
    });
});
