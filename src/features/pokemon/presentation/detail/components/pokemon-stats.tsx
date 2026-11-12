import type { PokemonDetail } from '@/features/pokemon/domain/pokemon';
import { View } from 'react-native';
import { PixelText } from '../../components/pixel-ui';

type Props = Pick<PokemonDetail, 'stats'>;
const statLabels: Record<string, string> = { hp: 'HP', attack: 'Attack', defense: 'Defense', 'special-attack': 'Special Attack', 'special-defense': 'Special Defense', speed: 'Speed' };
const PokemonStats = ({ stats }: Props) => (
    <View className="bg-white rounded-2xl p-4 mt-4 border border-[#d8dce4]">
        <PixelText accessibilityRole="header" style={{ fontSize: 20, marginBottom: 8 }}>Base stats</PixelText>
        {stats.map((stat) => (
            <View key={stat.name} accessible accessibilityLabel={`${statLabels[stat.name] ?? stat.name}: ${stat.value}`} className="flex-row justify-between py-2 border-b border-[#e5e7eb]">
                <PixelText style={{ flex: 1 }}>{statLabels[stat.name] ?? stat.name}</PixelText>
                <PixelText>{stat.value}</PixelText>
            </View>
        ))}
    </View>
);
export default PokemonStats;
