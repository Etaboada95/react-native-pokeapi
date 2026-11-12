import type { PokemonDetail } from '@/features/pokemon/domain/pokemon';
import { View } from 'react-native';
import { PixelText } from '../../components/pixel-ui';

type Props = Pick<PokemonDetail, 'abilities'>;
const PokemonAbilities = ({ abilities }: Props) => (
    <View className="bg-white rounded-2xl p-4 mt-4 border border-[#d8dce4]">
        <PixelText accessibilityRole="header" style={{ fontSize: 20, marginBottom: 8 }}>Abilities</PixelText>
        {abilities.map((ability) => <PixelText key={ability} style={{ textTransform: 'capitalize', paddingVertical: 4 }}>{ability.replace(/-/g, ' ')}</PixelText>)}
    </View>
);
export default PokemonAbilities;
