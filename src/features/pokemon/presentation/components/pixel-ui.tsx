import { Pressable, StyleSheet, Text, type PressableProps, type TextProps } from 'react-native';

export function PixelText({ style, ...props }: TextProps) {
    return <Text {...props} style={[styles.text, style]} />;
}

export function PixelButton({ title, onPress, accessibilityLabel }: { title: string; onPress: PressableProps['onPress']; accessibilityLabel?: string }) {
    return (
        <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} onPress={onPress} style={styles.button}>
            <PixelText style={styles.buttonText}>{title}</PixelText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: { fontFamily: 'PixelifySans-Regular', fontSize: 17, color: '#1d2942' },
    button: { backgroundColor: '#a32638', borderRadius: 12, minHeight: 48, minWidth: 48, paddingHorizontal: 18, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
    buttonText: { color: '#ffffff', fontSize: 17 }
});
