import React, { useState } from 'react';
import { createChunkCompression, previewChunkCompression } from 'services';
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
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setPreview(null);
        setError(null);
        setStyle(STYLE_OPTIONS[0].value);
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(e.target.value);
        setPreview(null);
        setError(null);
    };

    const handlePreview = async () => {
        if (!chunk) return;
        setLoading(true);
        setError(null);
        try {
            const res = await previewChunkCompression(chunk.id, style);
            setPreview(res.compressed_text);
        } catch (err: any) {
            setError('Failed to generate preview.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!chunk || !preview) return;
        setSaving(true);
        setError(null);
        try {
            await createChunkCompression(chunk.id, { title: style, compressed_text: preview });
            handleClose();
            // Trigger refetch of the specific chunk to include the new compression data
            if (onCompressionCreated) onCompressionCreated();
        } catch (err: any) {
            setError('Failed to save compression.');
        } finally {
            setSaving(false);
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
                onPreview={handlePreview}
                loading={loading}
                preview={preview}
                error={error}
                onSave={handleSave}
                saving={saving}
                canPreview={!loading && !!style && !!chunk}
                canSave={!!preview && !saving}
            />
        </>
    );
};

export default CompressionTool;
