import { PokemonRepository } from '../pokemon-repository';

export function getPokemonSpecies(repository: PokemonRepository, name: string) {
    return repository.getSpecies(name);
}
