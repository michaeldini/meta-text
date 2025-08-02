import { render } from "../../test-utils";
import { screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { Suspense } from "react";
import { vi } from "vitest";

// Mocks for useHomepage hook
vi.mock("./hooks/useHomepage", () => ({
    useHomepage: () => ({
        sourceDocs: [{ id: 1, name: "Doc 1" }],
        metatexts: [{ id: 1, title: "Meta 1" }],
        refetchSourceDocs: vi.fn(),
        refetchMetatexts: vi.fn(),
    }),
}));

// Optionally mock child pages if you want to isolate HomePage
vi.mock("@pages/Metatext/MetatextPage", () => ({ default: () => <div>MetatextPage</div> }));
vi.mock("@pages/SourceDocument/SourceDocPage", () => ({ default: () => <div>SourceDocPage</div> }));



// Tests for HomePage component

describe("HomePage", () => {

    it("renders homepage container and content", async () => {
        render(<HomePage />);
        expect(screen.getByTestId("page-container")).toBeInTheDocument();
        expect(screen.getByTestId("homepage-content")).toBeInTheDocument();
    });

    it("renders WelcomeText and HomePageDetails components", async () => {
        render(<HomePage />);
        expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
        // Optionally check for HomePageDetails content if it has a unique text
        // expect(await screen.findByText(/details/i)).toBeInTheDocument();
    });
});