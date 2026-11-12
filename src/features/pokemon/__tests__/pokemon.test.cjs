const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadModule(relativePath, mocks) {
    const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
    const code = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
    }).outputText;
    const exports = {};
    const requireMock = (id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        throw new Error(`Unexpected dependency: ${id}`);
    };
    new Function('exports', 'require', code)(exports, requireMock);
    return exports;
}

function repository(api) {
    return loadModule('data/pokemon-repository.ts', {
        './api/pokeapi-client': api
    }).pokemonRepository;
}

test('list maps names and preserves pagination boundaries', async () => {
    let requestedOffset;
    const repo = repository({
        fetchPokemonList: async ({ pageParam }) => {
            requestedOffset = pageParam;
            return { results: [{ name: 'bulbasaur', url: 'unused' }], next: 'next-page' };
        }
    });

    assert.deepEqual(await repo.getList(20), {
        results: [{ name: 'bulbasaur' }],
        nextOffset: 40
    });
    assert.equal(requestedOffset, 20);

    const lastPage = repository({
        fetchPokemonList: async () => ({ results: [], next: null })
    });
    assert.deepEqual(await lastPage.getList(40), { results: [], nextOffset: null });
});

test('detail maps relevant fields and accepts missing optional data', async () => {
    const repo = repository({
        fetchPokemonDetail: async () => ({
            id: 1,
            name: 'bulbasaur',
            sprites: { front_default: null },
            types: [{ type: { name: 'grass' } }],
            abilities: [{ ability: { name: 'overgrow' } }, { ability: null }],
            height: 7,
            weight: 69,
            base_experience: null,
            stats: [{ stat: { name: 'hp' }, base_stat: 45 }]
        })
    });

    assert.deepEqual(await repo.getDetail('bulbasaur'), {
        id: 1,
        name: 'bulbasaur',
        imageUrl: null,
        types: ['grass'],
        abilities: ['overgrow'],
        height: 7,
        weight: 69,
        baseExperience: null,
        stats: [{ name: 'hp', value: 45 }]
    });
});

test('species selects English description, normalizes whitespace and handles missing translation', async () => {
    const repo = repository({
        fetchPokemonSpecies: async () => ({
            color: { name: 'green' },
            flavor_text_entries: [
                { language: { name: 'es' }, flavor_text: 'Semilla' },
                { language: { name: 'en' }, flavor_text: ' A\n  seed\fPokémon ' }
            ]
        })
    });
    assert.deepEqual(await repo.getSpecies('bulbasaur'), {
        color: 'green',
        description: 'A seed Pokémon'
    });

    const noEnglish = repository({
        fetchPokemonSpecies: async () => ({
            color: { name: 'blue' },
            flavor_text_entries: [{ language: { name: 'es' }, flavor_text: 'Azul' }]
        })
    });
    assert.deepEqual(await noEnglish.getSpecies('squirtle'), { color: 'blue', description: null });
});

test('repository propagates network errors', async () => {
    const error = new Error('Network unavailable');
    const repo = repository({
        fetchPokemonDetail: async () => {
            throw error;
        }
    });
    await assert.rejects(repo.getDetail('bulbasaur'), error);
});

function runDetailHook(pokemonQuery, speciesQuery, name = 'bulbasaur') {
    const queryResults = [pokemonQuery, speciesQuery];
    const options = [];
    const hook = loadModule('presentation/detail/hooks/use-pokemon-detail.ts', {
        '@/features/pokemon/data/pokemon-repository': { pokemonRepository: {} },
        '@/features/pokemon/domain/use-cases/get-pokemon-detail': { getPokemonDetail() {} },
        '@/features/pokemon/domain/use-cases/get-pokemon-species': { getPokemonSpecies() {} },
        '@tanstack/react-query': {
            useQuery(option) {
                options.push(option);
                return queryResults.shift();
            }
        }
    });
    return { result: hook.usePokemonDetail(name), options };
}

test('detail waits until both Pokémon and species are available', () => {
    const pokemon = { id: 1 };
    const first = runDetailHook({ data: pokemon }, { data: undefined });
    assert.equal(first.result.isLoading, true);
    assert.equal(first.result.data, undefined);
    assert.deepEqual(first.options[0].queryKey, ['pokemon-detail', 'bulbasaur']);
    assert.deepEqual(first.options[1].queryKey, ['species-bulbasaur']);

    const second = runDetailHook({ data: pokemon }, { data: { color: 'green', description: 'A seed Pokémon' } });
    assert.equal(second.result.isLoading, false);
    assert.equal(second.result.isError, false);
    assert.deepEqual(second.result.data, { pokemon, color: 'green', description: 'A seed Pokémon' });
});

test('detail reports a failed query and retries only the missing result', () => {
    const calls = [];
    const { result } = runDetailHook(
        { data: { id: 1 }, refetch: () => calls.push('pokemon') },
        { data: undefined, isError: true, refetch: () => calls.push('species') }
    );
    assert.equal(result.isError, true);
    assert.equal(result.isLoading, false);
    result.retry();
    assert.deepEqual(calls, ['species']);
});

test('detail handles a missing name without starting queries', () => {
    const { result, options } = runDetailHook({ data: undefined }, { data: undefined }, '');
    assert.equal(result.isError, true);
    assert.equal(result.isLoading, false);
    assert.equal(options[0].enabled, false);
    assert.equal(options[1].enabled, false);
    result.retry();
});
