import React from 'react';
import { Box, TextField, Button, Alert, Paper, Typography } from '@mui/material';

/**
 * Generalized form for creating or uploading items with a title, widget, and button.
 *
 * Props:
 * - titleLabel: string (label for the form title)
 * - widget: ReactNode (custom widget, e.g. file input or select)
 * - textLabel: string (label for the text input)
 * - textValue: string (value for the text input)
 * - onTextChange: function (handler for text input change)
 * - buttonLabel: string (button text)
 * - buttonLoadingLabel: string (button text when loading)
 * - loading: boolean (button loading state)
 * - onSubmit: function (form submit handler)
 * - error: string (error message)
 * - success: string (success message)
 * - buttonProps: object (optional, extra props for the button)
 */
export default function GeneralCreateForm({
    titleLabel,
    widget,
    textLabel,
    textValue,
    onTextChange,
    buttonLabel,
    buttonLoadingLabel,
    loading = false,
    onSubmit,
    error = '',
    success = '',
    buttonProps = {},
}) {
    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>{titleLabel}</Typography>
            <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {widget}
                <TextField
                    label={textLabel}
                    value={textValue}
                    onChange={onTextChange}
                    required
                    sx={{ flexGrow: 1, minWidth: 180 }}
                />
                <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 120 }} {...buttonProps}>
                    {loading ? buttonLoadingLabel : buttonLabel}
                </Button>
                {error && <Alert severity="error" sx={{ ml: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ ml: 2 }}>{success}</Alert>}
            </Box>
        </Paper>
    );
}
