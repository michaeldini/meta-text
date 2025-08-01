// useDownloadMetatext.ts
// Hook to handle downloading a MetaText document as JSON from the backend.
// Encapsulates fetch, error, and download logic for use in UI components.

import React from 'react';
import { api } from '@utils/ky';
import { downloadJsonAsFile } from '@utils/downloadJsonAsFile'

export function useDownloadMetatext(metatextId?: number | null, disabled?: boolean) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    // TODO: eventually move to a separate service
    const handleDownload = async () => {
        if (metatextId == null || disabled) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.get(`metatext/${metatextId}/download`).json<any>();
            downloadJsonAsFile(data, `metatext_${metatextId}.json`);
        } catch (err: any) {
            setError(err.message || 'Download failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleDownload,
        disabled: loading || disabled,
    };
}
