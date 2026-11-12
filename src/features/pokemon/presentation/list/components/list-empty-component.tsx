import { View } from 'react-native';
import { PokemonListSkeleton } from '../../components/loading-skeletons';
import { PixelButton, PixelText } from '../../components/pixel-ui';
import { usePokemonList } from '../hooks/use-pokemon-list';

const ListEmptyComponent = () => {
    const { isLoading, isError, refetch } = usePokemonList();
    if (isLoading) return <PokemonListSkeleton />;
    return (
        <View className="flex-1 items-center justify-center py-12">
            {isError ? (
                <>
                    <PixelText>Could not load Pokémon.</PixelText>
                    <PixelButton title="Retry" onPress={() => refetch()} />
                </>
            ) : <PixelText>No Pokémon available.</PixelText>}
        </View>
    );
};
export default ListEmptyComponent;
