// DownloadMetatextButton.tsx
// Button to download the current MetaText as a JSON file from the backend.
// Handles fetch, error, and triggers browser download.

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DownloadIcon } from 'icons';
import { apiGet } from '../../../utils/api';
import { downloadJsonAsFile } from '../../../utils/downloadJsonAsFile';

interface DownloadMetatextButtonProps {
    metatextId: number;
    disabled?: boolean;
}

const DownloadMetatextButton: React.FC<DownloadMetatextButtonProps> = ({ metatextId, disabled }) => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleDownload = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use apiGet to fetch the JSON data (handles auth)
            const data = await apiGet<any>(`/api/metatext/${metatextId}/download`);
            // Use utility to trigger download
            downloadJsonAsFile(data, `metatext_${metatextId}.json`);
        } catch (err: any) {
            setError(err.message || 'Download failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tooltip title={error ? error : 'Download MetaText as JSON'}>
            <span>
                <IconButton
                    onClick={handleDownload}
                    disabled={loading || disabled}
                    color={error ? 'error' : 'primary'}
                    size="small"
                    aria-label="Download MetaText"
                >
                    <DownloadIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default DownloadMetatextButton;
