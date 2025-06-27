import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import { Box } from '@mui/material';
import { CreateForm } from '../../features/createform/components';
import { DocType } from '../../types/docTypes';

export interface CreateSectionProps {
    sourceDocs: any[];
    sourceDocsLoading: boolean;
    sourceDocsError: any;
    onSuccess: () => void;
    docType: DocType;
}

export const CreateSection: React.FC<CreateSectionProps> = ({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onSuccess,
    docType
}) => {
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={sourceDocsLoading}>
                <Box width="100%">
                    <CreateForm
                        sourceDocs={sourceDocs}
                        sourceDocsLoading={sourceDocsLoading}
                        sourceDocsError={sourceDocsError}
                        onSuccess={onSuccess}
                        docType={docType}
                        title={docType}
                    />
                </Box>
            </LoadingBoundary>
        </ErrorBoundary>
    );
};
