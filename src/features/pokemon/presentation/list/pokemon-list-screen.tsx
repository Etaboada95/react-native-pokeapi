import { Image } from 'expo-image';
import { FlatList, ListRenderItem, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PokemonListItem } from '../../domain/pokemon';
import ListEmptyComponent from './components/list-empty-component';
import ListFooterComponent from './components/list-footer-component';
import PokemonCard from './components/pokemon-card';
import { usePokemonList } from './hooks/use-pokemon-list';

const PokemonListScreen = () => {
    const { pokemon, hasNextPage, isFetching, fetchNextPage, isFetchNextPageError } = usePokemonList();
    const renderItem: ListRenderItem<PokemonListItem> = ({ item }) => <PokemonCard {...item} />;

    return (
        <SafeAreaView className="flex-1 bg-[#f8f5ee]" edges={['top', 'left', 'right']}>
            <FlatList
                strictMode
                className="flex-1"
                contentContainerClassName="px-5 pb-8 flex-grow max-w-2xl self-center w-full"
                data={pokemon}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                onEndReached={() => {
                    if (hasNextPage && !isFetching && !isFetchNextPageError) fetchNextPage();
                }}
                ListHeaderComponent={
                    <View className="items-center pt-5 pb-6">
                        <Image
                            source={require('@/assets/images/pokemon-logo.png')}
                            style={{ width: '75%', maxWidth: 300, aspectRatio: 900 / 387 }}
                            contentFit="contain"
                            accessible
                            accessibilityLabel="Pokémon"
                        />
                    </View>
                }
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
            />
        </SafeAreaView>
    );
};

export default PokemonListScreen;
