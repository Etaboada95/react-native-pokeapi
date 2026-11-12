export type PokemonDetail = {
    id: number;
    name: string;
    imageUrl: string | null;
    types: string[];
    abilities: string[];
    height: number;
    weight: number;
    baseExperience: number | null;
    stats: { name: string; value: number }[];
};

export type PokemonListItem = {
    name: string;
};

export type PokemonPage = {
    results: PokemonListItem[];
    nextOffset: number | null;
};

export type PokemonSpecies = {
    color: string;
    description: string | null;
};
