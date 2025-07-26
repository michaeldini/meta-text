import React, { useState } from 'react';

import { AiGenerationButton } from 'components';
import { generateSourceDocInfo } from 'services';
import { useSourceDocuments } from 'features/documents/useDocumentsData';
import { Button, Text } from '@chakra-ui/react';

interface GenerateSourceDocInfoButtonProps {
    sourceDocumentId: number;
    label?: string;
    toolTip?: string;
    onSuccess?: () => void;
}

export function GenerateSourceDocInfoButton(props: GenerateSourceDocInfoButtonProps): React.ReactElement {
    const { sourceDocumentId, label = 'Generate Info', toolTip = 'Generate or update document info using AI', onSuccess } = props;
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
                <Text color="red.500" mt={1}>{error}</Text>
            )}
        </>
    );
}

export default GenerateSourceDocInfoButton;
