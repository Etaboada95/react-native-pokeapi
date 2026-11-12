import { View } from 'react-native';
import type { PokemonListItem } from '../../../../domain/pokemon';
import { PixelButton, PixelText } from '../../../components/pixel-ui';
import { usePokemonImage } from '../../hooks/use-pokemon-image';
import { PokemonCardView } from './pokemon-card-view';

const PokemonCard = ({ name }: PokemonListItem) => {
    const query = usePokemonImage(name);
    return (
        <View>
            <PokemonCardView name={name} id={query.data?.id} imageUrl={query.data?.imageUrl ?? null} isLoading={query.isPending} />
            {query.isError && !query.data && (
                <View className="items-center pb-4">
                    <PixelText>Could not load data for {name}.</PixelText>
                    <PixelButton title="Retry" accessibilityLabel={`Retry loading ${name}`} onPress={() => query.refetch()} />
                </View>
            )}
        </View>
    );
};
export default PokemonCard;
