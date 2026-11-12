import type { PokemonDetail } from '@/features/pokemon/domain/pokemon';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { PixelText } from '../../components/pixel-ui';

type Props = Pick<PokemonDetail, 'id' | 'name' | 'imageUrl'> & { color: string };

const backgrounds: Record<string, string> = {
    red: '#fae4e3', blue: '#e1eefb', yellow: '#f8efca', green: '#e1f1e3',
    black: '#e7e9ec', brown: '#f0e7df', purple: '#eee5f4', gray: '#e9ecef',
    white: '#f1f1ef', pink: '#f8e6ed'
};

const PokemonHeader = ({ color, id, imageUrl, name }: Props) => (
    <View style={{ backgroundColor: backgrounds[color] ?? '#e9ecef' }} className="px-5 pb-6">
        <PixelText style={{ color: '#43516b', paddingTop: 16 }}>{`POKÉMON  #${String(id).padStart(3, '0')}`}</PixelText>
        <PixelText accessibilityRole="header" style={{ fontSize: 36, textTransform: 'capitalize', marginTop: 4 }}>{name}</PixelText>
        <Image source={imageUrl} style={{ width: '100%', height: 240 }} contentFit="contain" accessible accessibilityLabel={`Image of ${name}`} />
    </View>
);
export default PokemonHeader;
