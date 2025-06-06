import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '../constants';
import { useUniversalResponsive, getResponsiveSize } from '../utils/responsive';

// Web-compatible icon component
const WebIcon: React.FC<{ name: string; size: number; color: string; fallback: string }> = ({
    name, size, color, fallback
}) => {
    if (Platform.OS === 'web') {
        return (
            <Text style={{
                fontSize: size * 0.8,
                color,
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: size,
            }}>
                {fallback}
            </Text>
        );
    }
    return <Ionicons name={name as any} size={size} color={color} />;
};

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onToggle,
    size = 'md',
    disabled = false,
}) => {
    const deviceInfo = useUniversalResponsive();

    // Universal responsive checkbox sizing
    const getCheckboxSize = () => {
        let baseSize;
        switch (size) {
            case 'sm':
                baseSize = 20;
                break;
            case 'lg':
                baseSize = 32;
                break;
            default: // 'md'
                baseSize = 24;
        }
        return getResponsiveSize(baseSize, deviceInfo);
    };

    const checkboxSize = getCheckboxSize();
    const iconSize = Math.round(checkboxSize * 0.7);

    return (
        <TouchableOpacity
            onPress={disabled ? undefined : onToggle}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
                styles.checkboxContainer,
                {
                    width: checkboxSize,
                    height: checkboxSize,
                    opacity: disabled ? 0.6 : 1,
                },
                checked && styles.checkboxChecked,
            ]}
        >
            {checked && (
                <WebIcon
                    name="checkmark"
                    size={iconSize}
                    color={COLORS.text.white}
                    fallback="✓"
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 2,
        borderColor: COLORS.text.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // Enhanced accessibility
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
        }),
    },
    checkboxChecked: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
}); 