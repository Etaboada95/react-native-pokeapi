import { SplashScreen } from 'expo-router';
import { ReactNode, useEffect } from 'react';

export function InitProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return children;
}
