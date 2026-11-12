import type { PokemonDetail } from '@/features/pokemon/domain/pokemon';
import { View } from 'react-native';
import { PixelText } from '../../components/pixel-ui';

type Props = Pick<PokemonDetail, 'types'>;
const PokemonTypes = ({ types }: Props) => (
    <View className="bg-white rounded-2xl p-4 mt-4 border border-[#d8dce4]">
        <PixelText accessibilityRole="header" style={{ fontSize: 20, marginBottom: 8 }}>Types</PixelText>
        <View className="flex-row flex-wrap">
            {types.map((type) => (
                <View key={type} className="bg-[#e8edf4] rounded-full px-4 py-2 mr-2 mb-2">
                    <PixelText style={{ textTransform: 'capitalize' }}>{type}</PixelText>
                </View>
            ))}
        </View>
    </View>
);
export default PokemonTypes;
