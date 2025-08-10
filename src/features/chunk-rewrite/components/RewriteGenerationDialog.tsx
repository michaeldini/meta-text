/**
 * RewriteGenerationDialog
 * Drawer-based dialog mirroring ImageGenerationDialog pattern.
 */
import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Box } from '@chakra-ui/react/box';
import BaseDrawer from '@components/drawer/BaseDrawer';

export interface RewriteGenerationDialogProps {
    open: boolean;
    onClose: () => void;
    styleValue: string;
    onStyleChange: (val: string) => void;
    loading: boolean;
    error: string | null;
    onSubmit: () => Promise<void> | void;
}

const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Like I’m 5' },
    { value: 'like a bro', label: 'Like a Bro' },
    { value: 'academic', label: 'Academic' }
];

export function RewriteGenerationDialog(props: RewriteGenerationDialogProps) {
    const { open, onClose, styleValue, onStyleChange, loading, error, onSubmit } = props;
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => onStyleChange(e.target.value);
    const handleFormSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSubmit(); };

    return (
        <BaseDrawer
            open={open}
            onClose={onClose}
            title="Generate Rewrite"
            error={error}
            footer={
                <>
                    <Button type="button" onClick={onClose} disabled={loading} variant="ghost">Cancel</Button>
                    <Button type="submit" form="rewrite-gen-form" disabled={loading} loading={loading}>Generate & Save</Button>
                </>
            }
        >
            <form id="rewrite-gen-form" onSubmit={handleFormSubmit}>
                <Box>
                    <label htmlFor="rewrite-style">Rewrite style:</label>
                    <select
                        id="rewrite-style"
                        value={styleValue}
                        onChange={handleSelectChange}
                        style={{ width: '100%', marginTop: 8 }}
                        disabled={loading}
                    >
                        {STYLE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </Box>
            </form>
        </BaseDrawer>
    );
}

export default RewriteGenerationDialog;
