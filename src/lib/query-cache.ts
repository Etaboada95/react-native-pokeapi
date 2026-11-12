import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
    id: 'pokeapi'
});

const queryCacheStorage = {
    getItem(key: string) {
        return storage.getString(key) ?? null;
    },
    setItem(key: string, value: string) {
        storage.set(key, value);
    },
    removeItem(key: string) {
        storage.remove(key);
    }
};

export const queryClientPersister = createAsyncStoragePersister({ storage: queryCacheStorage });
