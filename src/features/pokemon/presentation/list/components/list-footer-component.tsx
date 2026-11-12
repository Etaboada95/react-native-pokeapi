import { ActivityIndicator, View } from 'react-native';
import { PixelButton, PixelText } from '../../components/pixel-ui';
import { usePokemonList } from '../hooks/use-pokemon-list';

const ListFooterComponent = () => {
    const { pokemon, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = usePokemonList();
    return pokemon.length > 0 ? (
        <View className="items-center my-8">
            {isFetchingNextPage ? <ActivityIndicator size="large" accessibilityLabel="Loading more Pokémon" color="#a32638" /> : isFetchNextPageError ? (
                <>
                    <PixelText>Could not load more Pokémon.</PixelText>
                    <PixelButton title="Retry" onPress={() => fetchNextPage()} />
                </>
            ) : null}
        </View>
    ) : null;
};
export default ListFooterComponent;
