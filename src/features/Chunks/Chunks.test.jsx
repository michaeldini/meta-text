import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Chunks from ".";

vi.mock("./Chunks.hook", () => ({
    __esModule: true,
    default: vi.fn(),
}));
import useChunks from "./Chunks.hook";

const mockUseChunks = useChunks;

describe("Chunks", () => {
    it("renders loading state", () => {
        mockUseChunks.mockReturnValue({ chunks: [], isLoading: true, error: null });
        render(<Chunks metaTextId={1} />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders error state", () => {
        mockUseChunks.mockReturnValue({ chunks: [], isLoading: false, error: "Error!" });
        render(<Chunks metaTextId={1} />);
        expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    it("renders chunks", () => {
        mockUseChunks.mockReturnValue({ chunks: [{ id: 1, content: "Chunk 1" }], isLoading: false, error: null });
        render(<Chunks metaTextId={1} />);
        expect(screen.getByText("Chunk 1")).toBeInTheDocument();
    });
});
