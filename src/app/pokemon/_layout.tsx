import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            title: '',
            headerStyle: { backgroundColor: '#f8f5ee' },
            headerTintColor: '#1d2942',
            headerShadowVisible: false
        }} />
    );
}
