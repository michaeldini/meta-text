import React, { useState } from 'react';
import { generateRewrite } from 'services/chunkService/generateRewrite';
import type { RewriteToolProps } from 'features/chunk-rewrite/types';
import RewriteToolButton from './components/RewriteToolButton';
import { RewriteDialog } from './components/RewriteDialog';

const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Explain like I’m 5' },
    { value: 'like a bro', label: 'Like a bro' },
    { value: 'academic', label: 'Academic' },
];


export function RewriteTool({ chunk, onRewriteCreated }: RewriteToolProps) {
    const [open, setOpen] = useState(false);
    const [style, setStyle] = useState(STYLE_OPTIONS[0].value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
        setStyle(STYLE_OPTIONS[0].value);
    };

    // Accepts a string value instead of ChangeEvent
    const handleStyleChange = (value: string) => {
        setStyle(value);
        setError(null);
    };

    const handleGenerateAndSave = async () => {
        if (!chunk) return;
        setLoading(true);
        setError(null);
        try {
            await generateRewrite(chunk.id, style);
            handleClose();
            if (onRewriteCreated) onRewriteCreated();
        } catch (err: any) {
            setError('Failed to generate rewrite.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* the user clicks this button to create a new rewrite (open dialog) */}
            <RewriteToolButton onClick={handleOpen} disabled={!chunk} />

            {/* Rewrite dialog for generating and saving rewrites */}
            <RewriteDialog
                open={open}
                onClose={handleClose}
                style={style}
                onStyleChange={handleStyleChange}
                options={STYLE_OPTIONS}
                onSave={handleGenerateAndSave}
                loading={loading}
                error={error}
                saving={loading}
                canSave={!loading && !!style && !!chunk}
            />
        </>
    );
}

export default RewriteTool;