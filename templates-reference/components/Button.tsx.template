import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants';
import { useUniversalResponsive, getResponsiveSize, getResponsivePadding, getResponsiveFontSize } from '../utils/responsive';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const deviceInfo = useUniversalResponsive();

    // Universal responsive button sizing for all devices
    const getButtonSizing = () => {
        let baseHeight, basePadding, baseFontSize;

        switch (size) {
            case 'sm':
                baseHeight = 36;
                basePadding = SPACING.md;
                baseFontSize = FONTS.size.sm;
                break;
            case 'lg':
                baseHeight = 56;
                basePadding = SPACING.xl;
                baseFontSize = FONTS.size.lg;
                break;
            default: // 'md'
                baseHeight = 44;
                basePadding = SPACING.lg;
                baseFontSize = FONTS.size.base;
        }

        return {
            height: getResponsiveSize(baseHeight, deviceInfo),
            paddingHorizontal: getResponsivePadding(basePadding, deviceInfo),
            fontSize: getResponsiveFontSize(baseFontSize, deviceInfo),
            borderRadius: Math.round(getResponsiveSize(baseHeight, deviceInfo) / 2),
        };
    };

    const sizing = getButtonSizing();

    const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
        const baseTextStyle: TextStyle = {
            fontSize: sizing.fontSize,
            fontWeight: '600', // Original Remember button font weight
            letterSpacing: 0.5, // Original Remember button letter spacing
            textAlign: 'center',
        };

        switch (variant) {
            case 'primary':
                return {
                    button: styles.primaryButton,
                    text: { ...baseTextStyle, color: COLORS.text.white },
                };
            case 'secondary':
                return {
                    button: styles.secondaryButton,
                    text: { ...baseTextStyle, color: COLORS.secondary },
                };
            case 'ghost':
                return {
                    button: styles.ghostButton,
                    text: { ...baseTextStyle, color: COLORS.primary },
                };
            case 'glass':
                return {
                    button: styles.glassButton,
                    text: { ...baseTextStyle, color: COLORS.text.primary },
                };
            case 'danger':
                return {
                    button: styles.dangerButton,
                    text: { ...baseTextStyle, color: COLORS.text.white },
                };
            default:
                return {
                    button: styles.primaryButton,
                    text: { ...baseTextStyle, color: COLORS.text.white },
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <TouchableOpacity
            style={[
                styles.baseButton,
                variantStyles.button,
                {
                    height: sizing.height,
                    paddingHorizontal: sizing.paddingHorizontal,
                    borderRadius: sizing.borderRadius,
                    width: fullWidth ? '100%' : undefined,
                    opacity: disabled ? 0.6 : 1,
                },
                style,
            ]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[variantStyles.text, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // Enhanced accessibility
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            userSelect: 'none',
        }),
    },

    // Primary button with spiritual gradient (Remember button purple)
    primaryButton: {
        backgroundColor: COLORS.secondary, // Use indigo/purple for Remember button
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)', // Original white border
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },

    // Secondary button with outline style
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.secondary,
        shadowColor: COLORS.shadowLight,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },

    // Ghost button (text only)
    ghostButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },

    // Glass morphism button
    glassButton: {
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.shadowLight,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },

    // Danger button for destructive actions
    dangerButton: {
        backgroundColor: COLORS.error,
        borderWidth: 1,
        borderColor: '#DC2626', // red-600
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
}); 