// Campos de PokéAPI utilizados por la aplicación.
// Documentación: https://pokeapi.co/docs/v2

export interface NamedAPIResource {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedAPIResource[];
}

export interface Pokemon {
    id: number;
    name: string;
    base_experience: number | null;
    height: number;
    weight: number;
    sprites: {
        front_default: string | null;
    };
    types: {
        type: NamedAPIResource;
    }[];
    abilities: {
        ability: NamedAPIResource | null;
    }[];
    stats: {
        base_stat: number;
        stat: NamedAPIResource;
    }[];
}

export interface SpeciesResponse {
    color: NamedAPIResource;
    flavor_text_entries: {
        flavor_text: string;
        language: NamedAPIResource;
    }[];
}
