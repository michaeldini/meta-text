// This file has been replaced by ModernList. Use ModernList directly or see SourceDocListModern usage pattern.

import React from 'react';
import ModernList from './ModernList';
import SourceDocListItem from './SourceDocListItem';

// Usage: <SourceDocListModern docs={...} ...otherProps />
export default function SourceDocListModern({
    docs,
    summaryError,
    onGenerateSummary,
    summaryLoading,
    deleteLoading,
    deleteError,
    onDelete
}) {
    return (
        <ModernList
            items={docs}
            emptyMessage="No documents found."
            renderItem={(doc) => (
                <SourceDocListItem
                    key={doc.id}
                    doc={doc}
                    summaryError={summaryError}
                    onGenerateSummary={onGenerateSummary}
                    summaryLoading={summaryLoading}
                    deleteLoading={deleteLoading}
                    deleteError={deleteError}
                    onDelete={onDelete}
                />
            )}
        />
    );
}
