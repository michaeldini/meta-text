import { useState, useCallback, KeyboardEvent } from 'react';

interface UseDropdownMenuReturn {
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    openMenu: (event: React.MouseEvent<HTMLElement>) => void;
    closeMenu: () => void;
    handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Hook for managing dropdown menu state and keyboard navigation
 * @returns Menu state and handlers with enhanced keyboard support
 */
export const useDropdownMenu = (): UseDropdownMenuReturn => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);

    const openMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const closeMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                closeMenu();
                break;
            case 'ArrowDown':
                if (!isOpen) {
                    event.preventDefault();
                    // Focus first menu item when opening with arrow key
                    const target = event.currentTarget as HTMLElement;
                    target.click();
                }
                break;
            case 'Enter':
            case ' ':
                if (!isOpen) {
                    event.preventDefault();
                    const target = event.currentTarget as HTMLElement;
                    target.click();
                }
                break;
            default:
                break;
        }
    }, [isOpen, closeMenu]);

    return {
        anchorEl,
        isOpen,
        openMenu,
        closeMenu,
        handleKeyDown,
    };
};
