/**
 * Get the height of the sticky toolbar to calculate proper scroll offset
 */
function getToolbarHeight(): number {
    const toolbar = document.getElementById('metatext-toolbar') as HTMLElement;
    if (toolbar) {
        const computedStyle = window.getComputedStyle(toolbar);
        const isSticky = computedStyle.position === 'sticky';
        if (isSticky) {
            return toolbar.offsetHeight;
        }
    }
    return 0;
}

/**
 * Get the absolute position of an element relative to the document
 */
function getElementTop(element: HTMLElement): number {
    let offsetTop = 0;
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
        offsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement;
    }

    return offsetTop;
}

export function scrollToChunkDOM(chunkId: number) {
    const el = document.querySelector(`[data-chunk-id="${chunkId}"]`) as HTMLElement;
    if (!el) return;

    const toolbarHeight = getToolbarHeight();

    if (toolbarHeight > 0) {
        // Calculate the absolute position of the element relative to the document
        const elementTop = getElementTop(el);
        const scrollPosition = elementTop - toolbarHeight - 10; // Add 10px padding

        window.scrollTo({
            top: Math.max(0, scrollPosition), // Ensure we don't scroll above page top
            behavior: 'smooth'
        });
    } else {
        // Fallback to original behavior if toolbar not found or not sticky
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
