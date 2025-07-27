// DownloadMetatextButton.tsx
// Button to download the current MetaText as a JSON file from the backend.
// Handles fetch, error, and triggers browser download.

import React from 'react';

import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { HiArrowDownTray } from "react-icons/hi2";
import { api, downloadJsonAsFile } from 'utils';


interface DownloadMetatextButtonProps {
    metatextId: number;
    disabled?: boolean;
}

export function DownloadMetatextButton({ metatextId, disabled }: DownloadMetatextButtonProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use ky instance to fetch the JSON data (handles auth)
            const data = await api.get(`metatext/${metatextId}/download`).json<any>();
            // Use utility to trigger download
            downloadJsonAsFile(data, `metatext_${metatextId}.json`);
        } catch (err: any) {
            setError(err.message || 'Download failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tooltip content={error ? error : 'Download MetaText as JSON'}>
            <IconButton
                onClick={handleDownload}
                disabled={loading || disabled}
                color={error ? 'error' : 'primary'}
                aria-label="Download MetaText"
                variant="ghost"
            >
                <HiArrowDownTray />
            </IconButton>
        </Tooltip>
    );
}

export default DownloadMetatextButton;
