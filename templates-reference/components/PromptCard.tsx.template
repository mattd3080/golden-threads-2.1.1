import React from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import { formatContentText } from '../utils';

interface PromptCardProps {
    text: string;
    style?: ViewStyle;
}

export const PromptCard: React.FC<PromptCardProps> = ({ text, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.text}>
                {formatContentText(text)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(248, 250, 252, 0.9)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
        color: '#4B5563',
    },
}); 