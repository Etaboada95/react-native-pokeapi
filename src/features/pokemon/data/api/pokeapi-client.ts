import { fetch } from 'react-native-nitro-fetch';
import { Pokemon, PokemonListResponse, SpeciesResponse } from './pokeapi-types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList({ pageParam }: { pageParam: number }): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=20&offset=${pageParam}`);

    if (!response.ok) {
        throw new Error(`Failed to load Pokémon list: HTTP ${response.status}`);
    }

    return response.json();
}

export async function fetchPokemonDetail(name: string): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);

    if (!response.ok) {
        throw new Error(`Failed to load Pokémon: HTTP ${response.status}`);
    }

    return response.json();
}

export async function fetchPokemonSpecies(name: string): Promise<SpeciesResponse> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${name}`);

    if (!response.ok) {
        throw new Error(`Failed to load Pokémon: HTTP ${response.status}`);
    }

    return response.json();
}
