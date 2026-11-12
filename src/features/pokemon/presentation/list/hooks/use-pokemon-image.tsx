import { useQuery } from '@tanstack/react-query';
import { pokemonRepository } from '../../../data/pokemon-repository';
import { getPokemonDetail } from '../../../domain/use-cases/get-pokemon-detail';

export function usePokemonImage(name: string) {
    return useQuery({
        queryKey: ['pokemon-detail', name],
        queryFn: () => getPokemonDetail(pokemonRepository, name),
        enabled: Boolean(name)
    });
}
