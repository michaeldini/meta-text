// ExperimentsPage
// A simple MP3 player page component. Replaces the previous experiments UI.
// Features: play/pause, progress bar, current time / duration, volume control,
// and a file input to load a local MP3. Put MP3 files in `public/audio/` and
// reference them at `/audio/your-file.mp3`.

import React, { useRef, useState, useEffect } from 'react';
import { Box, Flex, Button, Text, Stack } from '@styles';
import { FaPlay, FaPause } from 'react-icons/fa';

// ExperimentsPage
// Minimal MP3 player that only supports Play / Pause using the HTML5 <audio> element.
// Put MP3 files in `public/audio/` and reference them at `/audio/your-file.mp3`.

export function ExperimentsPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [src] = useState<string>('/audio/Its Over But I Tried Before.mp3'); // default file in public/audio/

    // When the element ends, ensure UI reflects stopped state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', onEnded);
        return () => audio.removeEventListener('ended', onEnded);
    }, []);

    // Sync play/pause state to the audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Pause on unmount
    useEffect(() => () => { audioRef.current?.pause(); }, []);

    const togglePlay = () => setIsPlaying(p => !p);

    return (
        <Flex css={{ flexDirection: 'column', minHeight: '100vh', padding: 24 }}>
            <Text css={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>MP3 Player</Text>

            <Box css={{ padding: 24, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                <Stack css={{ alignItems: 'flex-start', gap: 16 }}>
                    <audio ref={audioRef} src={src} preload="auto" />

                    <Button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <FaPause style={{ marginRight: 8 }} /> : <FaPlay style={{ marginRight: 8 }} />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </Button>

                    <Text css={{ fontSize: '0.875rem' }}>File: <span style={{ fontWeight: 600 }}>{src.replace('/audio/', '')}</span></Text>
                </Stack>
            </Box>
        </Flex>
    );
};

export default ExperimentsPage;


