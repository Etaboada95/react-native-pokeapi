import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactNode, useState } from 'react';
import { queryClientPersister } from '../lib/query-cache';

const CACHE_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function ScopedQueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 0,
                    networkMode: 'always',
                    gcTime: CACHE_RETENTION_MS,
                    retry: 1
                }
            }
        });
        return client;
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: queryClientPersister,
                maxAge: CACHE_RETENTION_MS,
                dehydrateOptions: { shouldDehydrateQuery: (query) => query.state.data !== undefined }
            }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}

export function AppQueryProvider({ children }: { children: ReactNode }) {
    return <ScopedQueryProvider>{children}</ScopedQueryProvider>;
}
