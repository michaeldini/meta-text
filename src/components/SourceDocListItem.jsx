import React from 'react';
import { ListItem, Box, Typography, Divider, Collapse, Alert } from '@mui/material';
import SourceDocDetails from './SourceDocDetails';
import DeleteButton from './DeleteButton';
import GenerateSourceDocInfoButton from './GenerateSummaryButton';
import aiStars from '../assets/ai-stars.png';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a single document row in the list.
 */
function SourceDocListItem({ doc, summaryError, onGenerateSummary, summaryLoading, deleteLoading, deleteError, onDelete }) {
    const navigate = useNavigate();
    const { id, title } = doc;

    const handleNavigate = () => navigate(`/sourceDocs/${encodeURIComponent(id)}`);
    const handleGenerateSummary = e => { e.stopPropagation(); onGenerateSummary(id); };
    const handleDelete = e => { e.stopPropagation(); onDelete(id); };

    return (
        <Collapse in={!deleteLoading[id] && !deleteError[id]} timeout={400}>
            <ListItem disablePadding>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, width: '100%' }}>
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
                        <GenerateSourceDocInfoButton
                            loading={summaryLoading[id]}
                            onClick={handleGenerateSummary}
                            icon={<img src={aiStars} alt="AI" />}
                            label="Generate Summary"
                        />
                        <DeleteButton
                            onClick={handleDelete}
                            disabled={deleteLoading[id]}
                            label="Delete Source Document"
                        />
                    </Box>
                    <SourceDocDetails doc={doc} summaryError={summaryError[id]} />
                </Box>
            </ListItem>
            {deleteError[id] && (
                <ListItem>
                    <Alert severity="error">{deleteError[id]}</Alert>
                </ListItem>
            )}
            <Divider />
        </Collapse>
    );
}

export default SourceDocListItem;
