import { Icon } from '@components/icons/Icon';
// Pagination component for chunk navigation
import React from 'react';
import { Center } from '@chakra-ui/react/center';
import { Pagination } from '@chakra-ui/react/pagination';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';

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

    const handlePageChange = (event: { page: number }) => {
        if (!disabled) {
            onPageChange(event.page);
        }
    };

    const handlePageClick = (page: number) => {
        if (!disabled) {
            onPageChange(page);
        }
    };

    return (
        <Center data-testid="chunk-pagination">
            <Pagination.Root
                // Chakra Pagination expects total items count when using pageSize
                count={totalItems}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={handlePageChange}
            >
                <ButtonGroup
                    variant="ghost"
                    color="fg"
                    data-testid="pagination-controls"
                >
                    <Pagination.PageText format="compact" />
                    <Pagination.PrevTrigger asChild color="fg">
                        <IconButton
                            aria-label="Previous page"
                            disabled={disabled || currentPage <= 1}
                            data-testid="prev-page-button"
                        >
                            <Icon name='PagePrev' />
                        </IconButton>
                    </Pagination.PrevTrigger>
                    <Pagination.Items
                        color="fg"
                        render={({ value }) => (
                            <IconButton
                                key={value}
                                variant={{ base: "ghost", _selected: "outline" }}
                                onClick={() => handlePageClick(value)}
                                disabled={disabled}
                                data-testid={`page-${value}-button`}
                            >
                                {value}
                            </IconButton>
                        )}
                    />
                    <Pagination.NextTrigger asChild color="fg">
                        <IconButton
                            aria-label="Next page"
                            disabled={disabled || currentPage >= totalPages}
                            data-testid="next-page-button"
                        >
                            <Icon name='PageNext' />
                        </IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Center>
    );
}
