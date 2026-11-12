import React, { ComponentType, ReactElement, ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppQueryProvider } from './AppQueryProvider';
import { InitProvider } from './InitProvider';

type ProviderItem = [ComponentType<{ children: ReactNode }>, Record<string, unknown>?];

type RootProviderProps = {
    children: ReactNode;
};

const buildProvidersTree = (providers: ProviderItem[], children: ReactNode): ReactElement => {
    return providers.reduceRight<ReactNode>((acc, [Provider, props]) => {
        const element = <Provider {...(props ?? {})}>{acc}</Provider>;
        if (!React.isValidElement(element)) {
            throw new Error('buildProvidersTree must return a ReactElement');
        }
        return element;
    }, children) as ReactElement;
};

export function RootProvider({ children }: RootProviderProps): ReactElement {
    const providerComponents: ProviderItem[] = [
        [GestureHandlerRootView, { style: { flex: 1 } }],
        [SafeAreaProvider],
        [AppQueryProvider],
        [InitProvider]
    ];

    const ProvidersTree = buildProvidersTree(providerComponents, children);
    return <>{ProvidersTree}</>;
}

export default RootProvider;
