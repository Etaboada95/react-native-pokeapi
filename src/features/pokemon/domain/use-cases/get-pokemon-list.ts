import type { PokemonRepository } from '../pokemon-repository';

export function getPokemonList(repository: PokemonRepository, offset: number) {
    return repository.getList(offset);
}
