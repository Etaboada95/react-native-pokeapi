import { Feather } from '@react-native-vector-icons/feather';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { PokemonDetail, PokemonListItem } from '../../../../domain/pokemon';
import { PixelButton, PixelText } from '../../../components/pixel-ui';

type PokemonCardViewProps = PokemonListItem & Pick<PokemonDetail, 'imageUrl'> & {
    id?: PokemonDetail['id'];
    isLoading: boolean;
};

export function PokemonCardView({ name, id, imageUrl, isLoading }: PokemonCardViewProps) {
    const [imageError, setImageError] = useState(false);
    const [imageAttempt, setImageAttempt] = useState(0);

    return (
        <View className="mb-3 rounded-2xl bg-white border border-[#d8dce4] overflow-hidden">
            <Link href={{ pathname: '/pokemon/[name]', params: { name } }} asChild>
                <Pressable accessibilityRole="link" accessibilityLabel={`View details for ${name}`} accessibilityState={{ busy: isLoading }} className="flex-row items-center p-3 min-h-[112px]">
                    <View className="w-24 h-24 rounded-xl bg-[#eef1f6] items-center justify-center">
                        {isLoading ? (
                            <View className="w-16 h-16 rounded-lg bg-[#d8dce4] animate-pulse reduce-motion:animate-none" />
                        ) : imageUrl && !imageError ? (
                            <Image key={imageAttempt} source={imageUrl} style={{ width: 96, height: 96 }} contentFit="contain" onError={() => setImageError(true)} accessible={false} />
                        ) : (
                            <Feather name="image" size={30} color="#43516b" accessible={false} />
                        )}
                    </View>
                    <View className="flex-1 ml-4">
                        <PixelText style={{ color: '#43516b' }}>{id != null ? `#${String(id).padStart(3, '0')}` : 'POKÉMON'}</PixelText>
                        <PixelText style={{ fontSize: 24, textTransform: 'capitalize', marginTop: 4 }}>{name}</PixelText>
                        <PixelText style={{ color: '#43516b', marginTop: 4 }}>{imageError ? 'Image could not load' : !isLoading && !imageUrl ? 'Image unavailable' : 'View details  ›'}</PixelText>
                    </View>
                </Pressable>
            </Link>
            {imageError && imageUrl && (
                <View className="px-4 pb-4">
                    <PixelButton title="Retry image" accessibilityLabel={`Retry image for ${name}`} onPress={() => { setImageError(false); setImageAttempt((attempt) => attempt + 1); }} />
                </View>
            )}
        </View>
    );
}
