import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
// Pagination component for chunk navigation
import React from 'react';
import { Flex, Button } from '@styles';

interface ChunkPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    pageSize?: number;
}

/**
 * ChunkPagination - Pagination controls for chunk navigation
 * 
 * Provides pagination controls with previous/next buttons and page numbers.
 * Handles page navigation and displays current page status.
 */
export function ChunkPagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    disabled = false,
    pageSize = 5
}: ChunkPaginationProps) {
    // Don't render if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    console.log(`Rendering ChunkPagination: currentPage=${currentPage}, totalPages=${totalPages}`);
    console.log(`Disabled: ${disabled}, PageSize: ${pageSize}`);

    const handlePageClick = (page: number) => {
        if (!disabled) {
            onPageChange(page);
        }
    };

    // Generate page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Flex data-testid="chunk-pagination">
            <Button
                size="sm"
                tone="default"
                aria-label="Previous page"
                disabled={disabled || currentPage <= 1}
                onClick={() => handlePageClick(currentPage - 1)}
                data-testid="prev-page-button"
                css={{ minWidth: 32 }}
            >
                <HiChevronLeft />
            </Button>
            {pageNumbers.map((page) => (
                <Button
                    key={page}
                    size="sm"
                    tone={page === currentPage ? 'primary' : 'default'}
                    onClick={() => handlePageClick(page)}
                    disabled={disabled}
                    data-testid={`page-${page}-button`}
                    css={{ minWidth: 32, fontWeight: page === currentPage ? 700 : 400 }}
                >
                    {page}
                </Button>
            ))}
            <Button
                size="sm"
                tone="default"
                aria-label="Next page"
                disabled={disabled || currentPage >= totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
                data-testid="next-page-button"
                css={{ minWidth: 32 }}
            >
                <HiChevronRight />
            </Button>
        </Flex>
    );
}
