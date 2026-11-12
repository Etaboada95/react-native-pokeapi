const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { QueryClient, QueryObserver } = require('@tanstack/react-query');
const { persistQueryClientSave, persistQueryClientRestore } = require('@tanstack/react-query-persist-client');
const { createAsyncStoragePersister } = require('@tanstack/query-async-storage-persister');

function loadModule(relativePath, mocks) {
    const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
    const code = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
    }).outputText;
    const exports = {};
    new Function('exports', 'require', code)(exports, (id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        throw new Error(`Unexpected dependency: ${id}`);
    });
    return exports;
}

function createConfiguredClient(persister) {
    const jsx = (type, props) => ({ type, props });
    const { AppQueryProvider } = loadModule('AppQueryProvider.tsx', {
        'react/jsx-runtime': { jsx, jsxs: jsx },
        'react': { useState: (create) => [create()] },
        '@tanstack/react-query': { QueryClient },
        '@tanstack/react-query-persist-client': { PersistQueryClientProvider: 'provider' },
        '../lib/query-cache': { queryClientPersister: persister }
    });
    const scoped = AppQueryProvider({ children: null });
    return scoped.type(scoped.props).props;
}

test('shared query persister reads the existing MMKV cache after moving out of the feature', async () => {
    const saved = { timestamp: Date.now(), buster: '', clientState: { mutations: [], queries: [] } };
    const values = new Map([['REACT_QUERY_OFFLINE_CACHE', JSON.stringify(saved)]]);
    const { queryClientPersister } = loadModule('../lib/query-cache.ts', {
        '@tanstack/query-async-storage-persister': { createAsyncStoragePersister },
        'react-native-mmkv': {
            createMMKV(options) {
                assert.equal(options.id, 'pokeapi');
                return {
                    getString: (key) => values.get(key),
                    set: (key, value) => values.set(key, value),
                    remove: (key) => values.delete(key)
                };
            }
        }
    });
    assert.deepEqual(await queryClientPersister.restoreClient(), saved);
    await queryClientPersister.removeClient();
    assert.equal(values.has('REACT_QUERY_OFFLINE_CACHE'), false);
});

test('retains saved queries and restores cached data for offline use', async () => {
    let saved;
    const persister = {
        persistClient: async (client) => { saved = JSON.parse(JSON.stringify(client)); },
        restoreClient: async () => saved,
        removeClient: async () => { saved = undefined; }
    };
    const { client, persistOptions } = createConfiguredClient(persister);
    const restored = new QueryClient({ defaultOptions: client.getDefaultOptions() });
    try {
        assert.equal(client.getDefaultOptions().queries.gcTime, 7 * 24 * 60 * 60 * 1000);
        assert.equal(persistOptions.maxAge, client.getDefaultOptions().queries.gcTime);
        assert.equal(client.getDefaultOptions().queries.staleTime, 0);
        client.setQueryData(['pokemon-detail', 'pikachu'], { name: 'pikachu' });
        await persistQueryClientSave({ queryClient: client, persister });
        await persistQueryClientRestore({ queryClient: restored, ...persistOptions });
        assert.deepEqual(restored.getQueryData(['pokemon-detail', 'pikachu']), { name: 'pikachu' });

        const observer = new QueryObserver(restored, {
            queryKey: ['pokemon-detail', 'pikachu'],
            queryFn: async () => { throw new Error('offline'); },
            retry: false
        });
        const events = [];
        const unsubscribe = observer.subscribe((result) => events.push(result));
        await observer.refetch();
        assert.ok(events.some((result) => result.isFetching && result.data?.name === 'pikachu'));
        assert.equal(observer.getCurrentResult().data.name, 'pikachu');
        assert.equal(observer.getCurrentResult().isRefetchError, true);
        await persistQueryClientSave({ queryClient: restored, ...persistOptions });
        const reopened = new QueryClient({ defaultOptions: client.getDefaultOptions() });
        try {
            await persistQueryClientRestore({ queryClient: reopened, ...persistOptions });
            assert.deepEqual(reopened.getQueryData(['pokemon-detail', 'pikachu']), { name: 'pikachu' });
        } finally {
            reopened.clear();
        }
        unsubscribe();
    } finally {
        client.clear();
        restored.clear();
    }
});

test('list reports loading while the persisted cache is being restored', () => {
    let restoring = true;
    let query = { data: undefined, isLoading: false };
    const { usePokemonList } = loadModule('../features/pokemon/presentation/list/hooks/use-pokemon-list.ts', {
        '@tanstack/react-query': { useInfiniteQuery: () => query, useIsRestoring: () => restoring },
        '../../../data/pokemon-repository': { pokemonRepository: {} },
        '../../../domain/use-cases/get-pokemon-list': { getPokemonList() {} }
    });
    assert.equal(usePokemonList().isLoading, true);
    query = { data: { pages: [{ results: [{ name: 'pikachu' }] }] }, isLoading: false };
    assert.equal(usePokemonList().isLoading, false);
    assert.equal(usePokemonList().pokemon[0].name, 'pikachu');
    restoring = false;
    query = { data: undefined, isLoading: false };
    assert.equal(usePokemonList().isLoading, false);
});

test('unchanged data keeps its reference and changed data receives a new reference', () => {
    const { client } = createConfiguredClient({});
    try {
        const first = client.setQueryData(['pokemon-detail', 'pikachu'], { name: 'pikachu', stats: [55] });
        const same = client.setQueryData(['pokemon-detail', 'pikachu'], { name: 'pikachu', stats: [55] });
        const changed = client.setQueryData(['pokemon-detail', 'pikachu'], { name: 'pikachu', stats: [60] });
        assert.strictEqual(same, first);
        assert.notStrictEqual(changed, same);
    } finally {
        client.clear();
    }
});
