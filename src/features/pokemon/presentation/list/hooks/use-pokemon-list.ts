import { useInfiniteQuery, useIsRestoring } from '@tanstack/react-query';
import { pokemonRepository } from '../../../data/pokemon-repository';
import { getPokemonList } from '../../../domain/use-cases/get-pokemon-list';

export function usePokemonList() {
    const isRestoring = useIsRestoring();
    const query = useInfiniteQuery({
        queryKey: ['pokemon-list'],
        queryFn: ({ pageParam }) => getPokemonList(pokemonRepository, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined
    });

    const pokemon = query.data?.pages.flatMap((page) => page.results) ?? [];

    return {
        pokemon,
        isLoading: !query.data && (query.isLoading || isRestoring),
        isError: query.isError,
        isFetching: query.isFetching,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isFetchNextPageError: query.isFetchNextPageError,
        fetchNextPage: query.fetchNextPage,
        refetch: query.refetch
    };
}
