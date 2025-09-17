export function scrollToChunkDOM(chunkId: number) {
    const el = document.querySelector(`[data-chunk-id="${chunkId}"]`);
    if (el) {
        (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
