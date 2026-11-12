import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { PokemonDetailSkeleton } from '../components/loading-skeletons';
import { PixelButton, PixelText } from '../components/pixel-ui';
import PokemonAbilities from './components/pokemon-abilities';
import PokemonHeader from './components/pokemon-header';
import PokemonInfo from './components/pokemon-info';
import PokemonStats from './components/pokemon-stats';
import PokemonTypes from './components/pokemon-types';
import { usePokemonDetail } from './hooks/use-pokemon-detail';

export default function PokemonDetailScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { data, isLoading, isError, retry } = usePokemonDetail(name);

    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-[#f8f5ee] px-5">
                <PixelText>Could not load Pokémon details.</PixelText>
                {name && <PixelButton title="Retry" onPress={retry} />}
            </View>
        );
    }
    if (isLoading || !data) {
        return <PokemonDetailSkeleton />;
    }

    const { pokemon, color, description } = data;
    return (
        <ScrollView className="flex-1 bg-[#f8f5ee]" contentContainerStyle={{ paddingBottom: 40 }}>
            <PokemonHeader name={pokemon.name} id={pokemon.id} imageUrl={pokemon.imageUrl} color={color} />
            <View className="px-5 max-w-2xl self-center w-full">
                {description && (
                    <View className="bg-white rounded-2xl p-4 mt-5 border border-[#d8dce4]">
                        <PixelText accessibilityRole="header" style={{ fontSize: 20, marginBottom: 8 }}>
                            About
                        </PixelText>
                        <PixelText style={{ lineHeight: 24 }}>{description}</PixelText>
                    </View>
                )}
                <PokemonTypes types={pokemon.types} />
                <PokemonAbilities abilities={pokemon.abilities} />
                <PokemonInfo height={pokemon.height} weight={pokemon.weight} baseExperience={pokemon.baseExperience} />
                <PokemonStats stats={pokemon.stats} />
            </View>
        </ScrollView>
    );
}
