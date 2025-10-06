/**
 * Custom pagination component for navigating through chunks of data.
 * 
 * Provides pagination controls with previous/next buttons and page numbers.
 * 
 * Simple setup:
 * - `currentPage` is a 1-based index of the current page. (passed as a prop)
 * - `totalPages` is the total number of pages available. (passed as a prop)
 * - `onPageChange(page)` is called with the new 1-based page number when a page is selected. (passed as a prop)
 * - button onClick calls `onPageChange` with the new page number derived from the button clicked or incremented/decremented. 
 * 
 * 
 */
import React from 'react';
import { Row, BaseButton } from '@styles';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface PaginationControlProps {
    /** Current page number */
    currentPage: number;
    /** Array of page numbers [1..totalPages] for rendering page buttons. */
    pageNumbers: number[];
    /** Callback function to change the page */
    onPageChange: (page: number) => void;
    /** Whether there is a previous page (from pagination hook) */
    hasPrev: boolean;
    /** Whether there is a next page (from pagination hook) */
    hasNext: boolean;
}

/**
 * PaginationControls - Pagination controls for chunk navigation
 * 
 * - Renders a compact control: Previous, numbered page buttons (1..totalPages), and Next.
 * - `currentPage` is a 1-based index representing the currently active page.
 * - Clicking a page button or Prev/Next invokes `onPageChange(page)` with the new 1-based page.
 * - Prev/Next controls are disabled at boundaries (currentPage <= 1 or currentPage >= totalPages)
 *   or when the `disabled` prop is true.
 *
 */
export function PaginationControls({
    currentPage,
    pageNumbers,
    onPageChange,
    hasPrev,
    hasNext,
}: PaginationControlProps) {

    /** Don't render if there's only one page or no pages */
    if (pageNumbers.length <= 1) {
        return null;
    }

    /**
     * Render block:
     * - Row layout
     * - [Prev] [pageNumbers.map()] [Next] buttons 
     * - `onPageChange` called with new page number on button clicks
     */
    return (
        <Row
            data-testid="chunk-pagination"
            justifyCenter
        >
            <BaseButton
                tone="default"
                aria-label="Previous page"
                disabled={!hasPrev}
                onClick={() => onPageChange(currentPage - 1)}
                data-testid="prev-page-button"
            >
                <HiChevronLeft />
            </BaseButton>
            {pageNumbers.map((page) => (
                <BaseButton
                    key={page}
                    tone={page === currentPage ? 'primary' : 'default'}
                    onClick={() => onPageChange(page)}
                    disabled={currentPage === page}
                    data-testid={`page-${page}-button`}
                >
                    {page}
                </BaseButton>
            ))}
            <BaseButton
                tone="default"
                aria-label="Next page"
                disabled={!hasNext}
                onClick={() => onPageChange(currentPage + 1)}
                data-testid="next-page-button"
            >
                <HiChevronRight />
            </BaseButton>
        </Row>
    );
}
