import type { PokemonDetail, PokemonPage, PokemonSpecies } from './pokemon';

export interface PokemonRepository {
    getDetail(name: string): Promise<PokemonDetail>;
    getList(offset: number): Promise<PokemonPage>;
    getSpecies(name: string): Promise<PokemonSpecies>;
}
