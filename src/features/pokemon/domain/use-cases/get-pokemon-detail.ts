import type { PokemonRepository } from '../pokemon-repository';

export function getPokemonDetail(repository: PokemonRepository, name: string) {
    return repository.getDetail(name);
}
