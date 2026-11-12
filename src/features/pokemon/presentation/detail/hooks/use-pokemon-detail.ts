import { pokemonRepository } from '@/features/pokemon/data/pokemon-repository';
import { getPokemonDetail } from '@/features/pokemon/domain/use-cases/get-pokemon-detail';
import { getPokemonSpecies } from '@/features/pokemon/domain/use-cases/get-pokemon-species';
import { useQuery } from '@tanstack/react-query';

export function usePokemonDetail(name: string) {
    const pokemonQuery = useQuery({
        queryKey: ['pokemon-detail', name],
        queryFn: () => getPokemonDetail(pokemonRepository, name!),
        enabled: Boolean(name)
    });

    const speciesQuery = useQuery({
        queryKey: [`species-${name}`],
        queryFn: () => getPokemonSpecies(pokemonRepository, name),
        enabled: Boolean(name)
    });

    const pokemon = pokemonQuery.data;
    const species = speciesQuery.data;
    const isError = !name || (!pokemon && pokemonQuery.isError) || (!species && speciesQuery.isError);
    const data =
        pokemon && species
            ? {
                  pokemon,
                  color: species.color,
                  description: species.description
              }
            : undefined;

    return {
        data,
        isLoading: !isError && !data,
        isError,
        retry: () => {
            if (!name) return;
            if (!pokemon) void pokemonQuery.refetch();
            if (!species) void speciesQuery.refetch();
        }
    };
}
