import { View } from 'react-native';

export function PokemonListSkeleton() {
    return (
        <View className="animate-pulse reduce-motion:animate-none" accessible accessibilityLabel="Loading Pokémon" accessibilityState={{ busy: true }} pointerEvents="none">
            {[0, 1, 2, 3].map((index) => (
                <View key={index} className="mb-3 rounded-2xl bg-white border border-[#d8dce4] flex-row items-center p-3 min-h-[112px]">
                    <View className="w-24 h-24 rounded-xl bg-[#d8dce4]" />
                    <View className="flex-1 ml-4">
                        <View className="w-12 h-4 rounded bg-[#d8dce4]" />
                        <View className="w-3/4 h-6 mt-2 rounded bg-[#d8dce4]" />
                        <View className="w-1/2 h-4 mt-2 rounded bg-[#d8dce4]" />
                    </View>
                </View>
            ))}
        </View>
    );
}

export function PokemonDetailSkeleton() {
    return (
        <View className="flex-1 bg-[#f8f5ee] px-5 pt-4 overflow-hidden" accessible accessibilityLabel="Loading Pokémon details" accessibilityState={{ busy: true }} pointerEvents="none">
            <View className="animate-pulse reduce-motion:animate-none">
                <View className="w-28 h-4 rounded bg-[#d8dce4]" />
                <View className="w-3/5 h-9 mt-3 rounded bg-[#d8dce4]" />
                <View className="h-60 mt-4 rounded-2xl bg-[#e8edf4]" />
                {[0, 1, 2].map((index) => (
                    <View key={index} className="mt-4 p-4 rounded-2xl bg-white border border-[#d8dce4]">
                        <View className="w-1/3 h-5 rounded bg-[#d8dce4]" />
                        <View className="h-4 mt-3 rounded bg-[#e8edf4]" />
                        <View className="w-3/4 h-4 mt-2 rounded bg-[#e8edf4]" />
                    </View>
                ))}
            </View>
        </View>
    );
}
