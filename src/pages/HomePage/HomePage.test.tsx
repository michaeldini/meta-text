import { render } from "../../test-utils";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock document data hooks to avoid real network / react-query behavior
vi.mock("@features/documents/useDocumentsData", () => ({
    useSourceDocuments: () => ({ data: [{ id: 1, name: "Doc 1" }] }),
    useMetatexts: () => ({ data: [{ id: 1, title: "Meta 1" }] }),
    useDeleteMetatext: () => ({ mutate: vi.fn() }),
    useDeleteSourceDocument: () => ({ mutate: vi.fn() }),
}));

// Mock section managers (keep them simple)
vi.mock("@sections/Metatext/MetatextManager", () => ({ default: () => <div data-testid='metatext-manager' /> }));
vi.mock("@sections/SourceDocuments/SourceDocumentsManager", () => ({ default: () => <div data-testid='source-docs-manager' /> }));

// Import after mocks so they take effect
import HomePage from "./HomePage";

describe("HomePage", () => {
    it("renders homepage container and content", () => {
        render(<HomePage />);
        expect(screen.getByTestId("page-container")).toBeInTheDocument();
        expect(screen.getByTestId("homepage-content")).toBeInTheDocument();
    });

    it("renders WelcomeText section", async () => {
        render(<HomePage />);
        expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
    });
});