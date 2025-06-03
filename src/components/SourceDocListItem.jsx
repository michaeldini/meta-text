import React from 'react';
import { Box, Typography, Divider, Collapse } from '@mui/material';
import DeleteButton from './DeleteButton';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a single document row in the list.
 */
function SourceDocListItem({ doc, deleteLoading, deleteError, onDelete }) {
    const navigate = useNavigate();
    const { id, title } = doc;

    const handleNavigate = () => navigate(`/sourceDocs/${encodeURIComponent(id)}`);
    const handleDelete = e => { e.stopPropagation(); onDelete(id); };

    return (
        <Collapse in={!deleteLoading[id] && !deleteError[id]} timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Typography
                    variant="h6"
                    sx={{
                        p: 2,
                        flex: 1,
                        cursor: 'pointer',
                        transition: 'color 0.2s, transform 0.2s',
                        '&:hover': {
                            color: 'primary.main',
                            transform: 'translateY(-2px) scale(1.03)',
                            textDecoration: 'underline',
                        },
                    }}
                    onClick={handleNavigate}
                    noWrap={false}
                >
                    {title}
                </Typography>
                <DeleteButton
                    onClick={handleDelete}
                    disabled={deleteLoading[id]}
                    label="Delete Source Document"
                />
            </Box>
            <Divider />
        </Collapse>
    );
}

export default SourceDocListItem;
