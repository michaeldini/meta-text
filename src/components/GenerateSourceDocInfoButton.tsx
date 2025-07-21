import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { AiGenerationButton } from 'components';
import { generateSourceDocInfo } from 'services';
import { useSourceDocuments } from 'features/documents/useDocumentsData';

interface GenerateSourceDocInfoButtonProps {
    sourceDocumentId: number;
    label?: string;
    toolTip?: string;
    onSuccess?: () => void;
}

const GenerateSourceDocInfoButton: React.FC<GenerateSourceDocInfoButtonProps> = ({
    sourceDocumentId,
    label = 'Generate Info',
    toolTip = 'Generate or update document info using AI',
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refetch: refetchSourceDocs } = useSourceDocuments();

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        try {
            await generateSourceDocInfo(sourceDocumentId);
            await refetchSourceDocs(); // Refresh after update
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to generate info');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AiGenerationButton
                label={label}
                toolTip={toolTip}
                onClick={handleClick}
                loading={loading}
            />
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
            )}
        </>
    );
};

export default GenerateSourceDocInfoButton;
