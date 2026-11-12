import type { PokemonDetail } from '@/features/pokemon/domain/pokemon';
import { View } from 'react-native';
import { PixelText } from '../../components/pixel-ui';

type Props = Pick<PokemonDetail, 'height' | 'weight' | 'baseExperience'>;
const PokemonInfo = ({ baseExperience, height, weight }: Props) => (
    <View className="bg-white rounded-2xl p-4 mt-4 border border-[#d8dce4]">
        <PixelText accessibilityRole="header" style={{ fontSize: 20, marginBottom: 8 }}>Measurements</PixelText>
        <PixelText>Height: {height / 10} m</PixelText>
        <PixelText>Weight: {weight / 10} kg</PixelText>
        <PixelText>Base experience: {baseExperience ?? 'Not available'}</PixelText>
    </View>
);
export default PokemonInfo;
