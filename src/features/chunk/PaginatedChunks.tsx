
import type { ChunkType } from '@mtypes/documents';
import Chunk from '@features/chunk/Chunk';
import { Boundary } from '@components/Boundaries';
import { AppAlert } from '@components/AppAlert'
import { Box } from '@chakra-ui/react/box';
import { Stack } from '@chakra-ui/react/stack';
import { Center } from '@chakra-ui/react/center';
import { Pagination } from '@chakra-ui/react/pagination';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

// Props for PaginatedChunks component
export interface PaginatedChunksProps {
    paginatedChunks: ChunkType[];
    // displayChunks: ChunkType[];
    // loadingChunks: boolean;
    // chunksError: string | null;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    chunksPerPage: number;
    pageCount: number;
    startIdx: number;
    endIdx: number;
    // bookmarkedChunkId: number | null;
}



// Main component to display paginated chunks
const PaginatedChunks = ({
    paginatedChunks,
    // displayChunks,
    // loadingChunks,
    // chunksError,
    currentPage,
    setCurrentPage,
    chunksPerPage,
    pageCount,
    startIdx,
    endIdx,
}: PaginatedChunksProps) => {
    return (
        <Boundary>

            <Box data-testid="chunks-container">
                <Stack gap={4}>
                    <Center>
                        <Pagination.Root
                            count={pageCount}
                            pageSize={chunksPerPage}
                            page={currentPage}
                            onPageChange={e => setCurrentPage(e.page)}
                        >
                            <ButtonGroup variant="ghost" color="fg" >
                                <Pagination.PageText format='compact' />
                                <Pagination.PrevTrigger asChild color="fg" >
                                    <IconButton aria-label="Previous page" >
                                        <HiChevronLeft />
                                    </IconButton>
                                </Pagination.PrevTrigger>
                                <Pagination.Items
                                    color="fg"
                                    render={({ value }) => (
                                        <IconButton
                                            key={value}
                                            variant={{ base: "ghost", _selected: "outline" }}
                                            onClick={() => setCurrentPage(value)}
                                        >
                                            {value}
                                        </IconButton>
                                    )}
                                />
                                <Pagination.NextTrigger asChild color="fg" >
                                    <IconButton aria-label="Next page">
                                        <HiChevronRight />
                                    </IconButton>
                                </Pagination.NextTrigger>
                            </ButtonGroup>
                        </Pagination.Root>
                    </Center>
                    {paginatedChunks.map((chunk: ChunkType, chunkIdx: number) => (
                        <Chunk
                            key={chunk.id}
                            chunk={chunk}
                            chunkIdx={startIdx + chunkIdx}
                        />
                    ))}
                </Stack>
            </Box>
        </Boundary>
    );
};

export default PaginatedChunks;

