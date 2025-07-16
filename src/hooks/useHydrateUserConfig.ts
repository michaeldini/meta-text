
import { useEffect } from 'react';
import { hydrateUserConfig, fetchUserConfig } from '../services/userConfigService';


export function useHydrateUserConfig(onLoaded?: () => void) {
    useEffect(() => {
        fetchUserConfig().then((config) => {
            hydrateUserConfig(config);
            if (onLoaded) onLoaded();
        });
    }, []);
}
