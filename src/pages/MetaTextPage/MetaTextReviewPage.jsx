import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import { fetchWordlist } from '../../services/reviewService';
import logger from '../../utils/logger';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { metaTextDetailRoute } from '../../routes';

const columns = [
    { id: 'word', label: 'Word' },
    // { id: 'context', label: 'Context' },
    { id: 'definition', label: 'Definition' },
    { id: 'definition_with_context', label: 'Definition (with Context)' },
    // { id: 'created_at', label: 'Created At' },
];

export default function MetaTextReviewPage() {
    const [wordlist, setWordlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id: metatextId } = useParams();

    useEffect(() => {
        async function loadWordlist() {
            try {
                setLoading(true);
                const data = await fetchWordlist(metatextId);
                setWordlist(Array.isArray(data) ? data : []);
                logger.info('Wordlist loaded', data);
            } catch (err) {
                setError('Failed to load wordlist.');
                logger.error('Failed to load wordlist', err);
            } finally {
                setLoading(false);
            }
        }
        if (metatextId) loadWordlist();
    }, [metatextId]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {metatextId && (
                    <Tooltip title="Back to MetaText Detail">
                        <IconButton onClick={() => navigate(metaTextDetailRoute(metatextId))}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <Typography variant="h4" gutterBottom sx={{ ml: metatextId ? 1 : 0 }}>Wordlist</Typography>
            </Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                wordlist.length === 0 ? (
                    <Alert severity="info">No words found in the wordlist.</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map(col => (
                                        <TableCell key={col.id}>{col.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {wordlist.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.word}</TableCell>
                                        {/* <TableCell>{row.context}</TableCell> */}
                                        <TableCell>{row.definition}</TableCell>
                                        <TableCell>{row.definition_with_context}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
        </Box>
    );
}
