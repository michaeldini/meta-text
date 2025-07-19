import React, { useState } from 'react';
import { generateAndSaveChunkCompression } from 'services';
import type { CompressionToolProps } from 'features/chunk-shared/types';
import CompressionToolButton from './components/CompressionToolButton';
import CompressionDialog from './components/CompressionDialog';

const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Explain like I’m 5' },
    { value: 'like a bro', label: 'Like a bro' },
    { value: 'academic', label: 'Academic' },
];

const CompressionTool: React.FC<CompressionToolProps> = ({ chunk, onCompressionCreated }) => {
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

    const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(e.target.value);
        setError(null);
    };

    const handleGenerateAndSave = async () => {
        if (!chunk) return;
        setLoading(true);
        setError(null);
        try {
            await generateAndSaveChunkCompression(chunk.id, style);
            handleClose();
            if (onCompressionCreated) onCompressionCreated();
        } catch (err: any) {
            setError('Failed to generate compression.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* the user clicks this button to create a new compression (open dialog) */}
            <CompressionToolButton onClick={handleOpen} disabled={!chunk} />

            {/* Compression dialog for generating and saving compressions */}
            <CompressionDialog
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
};

export default CompressionTool;
