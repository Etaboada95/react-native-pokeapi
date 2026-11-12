import type { PokemonRepository } from '../domain/pokemon-repository';
import { fetchPokemonDetail, fetchPokemonList, fetchPokemonSpecies } from './api/pokeapi-client';

export const pokemonRepository: PokemonRepository = {
    async getList(offset) {
        const page = await fetchPokemonList({ pageParam: offset });
        return {
            results: page.results.map(({ name }) => ({ name })),
            nextOffset: page.next ? offset + 20 : null
        };
    },
    async getDetail(name) {
        const pokemon = await fetchPokemonDetail(name);
        return {
            id: pokemon.id,
            name: pokemon.name,
            imageUrl: pokemon.sprites.front_default,
            types: pokemon.types.map((item) => item.type.name),
            abilities: pokemon.abilities.flatMap((item) => (item.ability ? [item.ability.name] : [])),
            height: pokemon.height,
            weight: pokemon.weight,
            baseExperience: pokemon.base_experience,
            stats: pokemon.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat }))
        };
    },
    async getSpecies(name) {
        const species = await fetchPokemonSpecies(name);

        return {
            color: species.color.name,
            description:
                species.flavor_text_entries
                    .find((entry) => entry.language.name === 'en')
                    ?.flavor_text.replace(/\s+/g, ' ')
                    .trim() ?? null
        };
    }
};
