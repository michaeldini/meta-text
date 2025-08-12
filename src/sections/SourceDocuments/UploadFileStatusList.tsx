// Renders list of files with upload statuses and overall progress feedback.
import React from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react/wrap';
import { Tag } from '@chakra-ui/react/tag';
import { Text } from '@chakra-ui/react/text';
import { Box } from '@chakra-ui/react/box';
import { Flex } from '@chakra-ui/react/flex';
import { Tooltip } from '@components/ui/tooltip';

export interface UploadStatus {
    uploading: boolean;
    success: boolean;
    error: string | null;
}

interface UploadFileStatusListProps {
    files: File[];
    statuses: UploadStatus[];
}

function deriveStatus(file: File, status?: UploadStatus) {
    if (!status) return { colorPalette: 'gray', label: file.name } as const;
    if (status.uploading) return { colorPalette: 'yellow', label: `${file.name} (Uploading...)` } as const;
    if (status.success) return { colorPalette: 'green', label: `${file.name} (Uploaded)` } as const;
    if (status.error) return { colorPalette: 'red', label: `${file.name} (Error)` } as const;
    return { colorPalette: 'gray', label: file.name } as const;
}

export const UploadFileStatusList: React.FC<UploadFileStatusListProps> = ({ files, statuses }) => {
    if (!files.length) return null;

    const total = files.length;
    const completed = statuses.filter(s => s && (s.success || s.error)).length;
    const uploadingCount = statuses.filter(s => s && s.uploading).length;
    const anyError = statuses.some(s => s && !!s.error);
    // const percent = total ? Math.round((completed / total) * 100) : 0;

    return (
        <Box mt={2} width="100%">
            <Flex justify="space-between" align="center" mb={1} flexWrap="wrap" gap={2}>
                <Text fontWeight="bold">Files to upload:</Text>
                <Text fontSize="sm" color="fg.muted" aria-live="polite">
                    {completed === total && total > 0
                        ? anyError
                            ? `Completed with ${statuses.filter(s => s.error).length} error(s)`
                            : 'All uploads completed'
                        : uploadingCount > 0
                            ? `Uploading ${completed + uploadingCount}/${total}...`
                            : `Ready (${total})`}
                </Text>
            </Flex>
            {/* Progress bar omitted due to Chakra namespace import issues; can be re-added when component is available */}
            <Wrap>
                {files.map((f, idx) => {
                    const status = statuses[idx];
                    const { colorPalette, label } = deriveStatus(f, status);
                    const key = `${f.name}-${f.lastModified}-${f.size}-${idx}`;
                    const tag = (
                        <Tag.Root colorPalette={colorPalette} variant="solid" size="md" maxW="260px">
                            <Tag.Label truncate>{label}</Tag.Label>
                        </Tag.Root>
                    );
                    return (
                        <WrapItem key={key}>
                            {status?.error ? (
                                <Tooltip content={status.error} positioning={{ placement: 'top' }}>
                                    {tag}
                                </Tooltip>
                            ) : tag}
                        </WrapItem>
                    );
                })}
            </Wrap>
        </Box>
    );
};

export default UploadFileStatusList;
