// Renders list of files with upload statuses and overall progress feedback.
import React from 'react';
import { Wrap, WrapItem, TagRoot, TagLabel, Text, Box, Flex } from '@styles';
import TooltipButton from '@components/TooltipButton';

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

export function UploadFileStatusList({ files, statuses }: UploadFileStatusListProps) {
    if (!files.length) return null;

    const total = files.length;
    const completed = statuses.filter(s => s && (s.success || s.error)).length;
    const uploadingCount = statuses.filter(s => s && s.uploading).length;
    const anyError = statuses.some(s => s && !!s.error);
    // const percent = total ? Math.round((completed / total) * 100) : 0;

    return (
        <Box style={{ marginTop: 8, width: '100%' }}>
            <Flex >
                <Text css={{ fontWeight: 'bold' }}>Files to upload:</Text>
                <Text css={{ fontSize: '0.9rem', color: '$colors$gray500' }} aria-live="polite">
                    {completed === total && total > 0
                        ? anyError
                            ? `Completed with ${statuses.filter(s => s && s.error).length} error(s)`
                            : 'All uploads completed'
                        : uploadingCount > 0
                            ? `Uploading ${completed + uploadingCount}/${total}...`
                            : `Ready (${total})`}
                </Text>
            </Flex>
            <Wrap>
                {files.map((f, idx) => {
                    const status = statuses[idx];
                    const { colorPalette, label } = deriveStatus(f, status);
                    const key = `${f.name}-${f.lastModified}-${f.size}-${idx}`;
                    const tag = (
                        <TagRoot colorPalette={colorPalette}>
                            <TagLabel>{label}</TagLabel>
                        </TagRoot>
                    );
                    return (
                        <WrapItem key={key}>
                            {status?.error ? (
                                <TooltipButton
                                    label={label}
                                    tooltip={status.error}
                                    tone={colorPalette === 'red' ? 'danger' : colorPalette === 'yellow' ? 'primary' : 'default'}
                                    size="md"
                                    disabled={false}
                                    style={{ padding: 0, background: 'none', border: 'none' }}
                                    icon={null}
                                    positioning={{ side: 'top', align: 'center', sideOffset: 6 }}
                                >
                                    {tag}
                                </TooltipButton>
                            ) : tag}
                        </WrapItem>
                    );
                })}
            </Wrap>
        </Box>
    );
}

export default UploadFileStatusList;
