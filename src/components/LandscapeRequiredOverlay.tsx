import React from 'react';

/**
 * Overlay that appears in portrait mode, asking user to rotate device.
 * Usage: Place <LandscapeRequiredOverlay /> at the root of your app (e.g. in App.tsx)
 */
const LandscapeRequiredOverlay: React.FC = () => {
    // Use a media query to detect portrait mode
    const [isPortrait, setIsPortrait] = React.useState(false);

    React.useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    if (!isPortrait) return null;
    return (
        <div className="landscape-required-overlay">
            Please rotate your device to landscape mode for the best experience.
        </div>
    );
};

export default LandscapeRequiredOverlay;
