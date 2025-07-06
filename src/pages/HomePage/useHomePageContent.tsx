import React from 'react';
import { SearchableList, CreateForm } from 'features';
import { DocType, ViewMode } from 'types';

export function useHomePageContent({
    docType,
    viewMode,
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    metaTexts,
    refreshData,
}: {
    docType: DocType;
    viewMode: ViewMode;
    sourceDocs: any[];
    sourceDocsLoading: boolean;
    sourceDocsError: any;
    metaTexts: any[];
    refreshData: () => void;
}) {
    const isSourceDoc = docType === DocType.SourceDoc;

    if (viewMode === ViewMode.Search) {
        return (
            <SearchableList
                items={isSourceDoc ? sourceDocs : metaTexts}
                filterKey="title"
                title={docType}
            />
        );
    }
    return (
        <CreateForm
            sourceDocs={sourceDocs}
            sourceDocsLoading={sourceDocsLoading}
            sourceDocsError={sourceDocsError}
            onSuccess={refreshData}
            docType={docType}
        />
    );
}
