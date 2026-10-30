import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./LoginPage";
import useAuthStore from "../store/authStore";

function renderLoginPage() {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("LoginPage", () => {
    it("keeps the Log in button disabled until both fields are filled", async () => {
        const user = userEvent.setup();
        renderLoginPage();
        const button = screen.getByRole("button", { name: "Log in" });

        expect(button).toBeDisabled();

        await user.type(screen.getByLabelText("Email"), "juan@dlsl.edu.ph");
        expect(button).toBeDisabled();

        await user.type(screen.getByLabelText("Password"), "secret123");
        expect(button).toBeEnabled();
    });

    it("sends nothing to the API while the form is incomplete", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByLabelText("Email"), "juan@dlsl.edu.ph");
        await user.click(screen.getByRole("button", { name: "Log in" }));

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("shows the API's message and stays logged out when the login fails", async () => {
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ message: "Invalid email or password" }), {
                status: 401,
            })
        );
        const user = userEvent.setup();
        renderLoginPage();

        await user.type(screen.getByLabelText("Email"), "juan@dlsl.edu.ph");
        await user.type(screen.getByLabelText("Password"), "wrong-password");
        await user.click(screen.getByRole("button", { name: "Log in" }));

        expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
        expect(fetchSpy).toHaveBeenCalledOnce();
        expect(useAuthStore.getState().token).toBeNull();
    });
});
