import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';

interface SaveState {
    saving: boolean;
    saved: boolean;
    error: boolean;
    retryCount: number;
    lastSaved?: Date;
}

interface SaveStateButtonProps {
    saveState: SaveState;
    onPress: () => void;
    defaultText: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export const SaveStateButton: React.FC<SaveStateButtonProps> = ({
    saveState,
    onPress,
    defaultText,
    disabled = false,
    style,
}) => {
    const { spacing, fonts } = useResponsiveStyles();

    const getSaveButtonText = (): string => {
        if (saveState.saving) return 'Saving...';
        if (saveState.saved) return 'Saved!';
        if (saveState.error) return 'Error';
        return defaultText;
    };

    const getSaveButtonStyle = () => ({
        width: 80,
        backgroundColor: saveState.saving
            ? '#9CA3AF'
            : saveState.saved
                ? '#10B981'
                : saveState.error
                    ? '#EF4444'
                    : '#4F46E5',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        ...style,
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || saveState.saving}
            style={getSaveButtonStyle()}
            activeOpacity={0.8}
        >
            <Text style={{
                color: 'white',
                fontWeight: '600',
                textAlign: 'center',
                fontSize: fonts.xs,
                letterSpacing: 0.3,
            }}>
                {getSaveButtonText()}
            </Text>
        </TouchableOpacity>
    );
}; 