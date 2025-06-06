import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, useWindowDimensions, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    variant?: 'default' | 'glass' | 'minimal' | 'spiritual';
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    editable?: boolean;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    autoFocus?: boolean;
}

export const Input: React.FC<InputProps> = ({
    value,
    onChangeText,
    placeholder,
    label,
    error,
    variant = 'default',
    multiline = false,
    numberOfLines = 1,
    maxLength,
    keyboardType = 'default',
    secureTextEntry = false,
    editable = true,
    style,
    inputStyle,
    autoFocus = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { width: screenWidth } = useWindowDimensions();

    // Responsive sizing based on screen width
    const getResponsiveStyles = () => {
        const isTablet = screenWidth >= 768;
        const isLargePhone = screenWidth >= 428;
        const isSmallPhone = screenWidth <= 375;

        return {
            fontSize: isTablet ? FONTS.size.lg : isLargePhone ? FONTS.size.base : isSmallPhone ? FONTS.size.sm : FONTS.size.base,
            padding: isTablet ? SPACING.lg : isLargePhone ? SPACING.md : isSmallPhone ? SPACING.sm : SPACING.md,
            borderRadius: isTablet ? BORDER_RADIUS.lg : BORDER_RADIUS.md,
        };
    };

    const responsiveStyles = getResponsiveStyles();

    const getVariantStyles = (): { container: ViewStyle; input: TextStyle } => {
        const baseInputStyle: TextStyle = {
            fontSize: responsiveStyles.fontSize,
            fontWeight: FONTS.weight.normal,
            color: COLORS.text.primary,
            padding: responsiveStyles.padding,
            textAlignVertical: multiline ? 'top' : 'center',
        };

        switch (variant) {
            case 'glass':
                return {
                    container: {
                        ...styles.glassContainer,
                        borderRadius: responsiveStyles.borderRadius,
                    },
                    input: baseInputStyle,
                };
            case 'minimal':
                return {
                    container: {
                        ...styles.minimalContainer,
                        borderRadius: responsiveStyles.borderRadius,
                    },
                    input: baseInputStyle,
                };
            case 'spiritual':
                return {
                    container: {
                        ...styles.spiritualContainer,
                        borderRadius: responsiveStyles.borderRadius,
                    },
                    input: {
                        ...baseInputStyle,
                        color: COLORS.text.primary,
                    },
                };
            default:
                return {
                    container: {
                        ...styles.defaultContainer,
                        borderRadius: responsiveStyles.borderRadius,
                    },
                    input: baseInputStyle,
                };
        }
    };

    const variantStyles = getVariantStyles();

    const getFocusedStyle = (): ViewStyle => {
        if (!isFocused) return {};

        switch (variant) {
            case 'glass':
                return {
                    borderColor: COLORS.primary,
                    backgroundColor: COLORS.glassStrong,
                    shadowOpacity: 0.3,
                };
            case 'spiritual':
                return {
                    borderColor: COLORS.secondary, // Use indigo instead of amber
                    backgroundColor: '#F8F7FF', // Keep the same light purple background when focused
                    shadowOpacity: 0.2,
                };
            default:
                return {
                    borderColor: COLORS.primary,
                    shadowOpacity: 0.15,
                };
        }
    };

    const getErrorStyle = (): ViewStyle => {
        if (!error) return {};
        return {
            borderColor: COLORS.error,
            borderWidth: 2,
        };
    };

    return (
        <View style={[styles.wrapper, style]}>
            {/* Label */}
            {label && (
                <Text style={[styles.label, { fontSize: responsiveStyles.fontSize * 0.875 }]}>
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <View
                style={[
                    variantStyles.container,
                    getFocusedStyle(),
                    getErrorStyle(),
                    !editable && styles.disabledContainer,
                ]}
            >
                <TextInput
                    style={[
                        variantStyles.input,
                        {
                            minHeight: multiline ? responsiveStyles.fontSize * numberOfLines * 1.5 : undefined,
                        },
                        !editable && styles.disabledInput,
                        inputStyle,
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.text.tertiary}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    autoFocus={autoFocus}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    // Platform-specific optimizations
                    {...(Platform.OS === 'ios' && {
                        clearButtonMode: 'while-editing',
                    })}
                    {...(Platform.OS === 'android' && {
                        underlineColorAndroid: 'transparent',
                    })}
                />
            </View>

            {/* Error Message */}
            {error && (
                <Text style={[styles.errorText, { fontSize: responsiveStyles.fontSize * 0.75 }]}>
                    {error}
                </Text>
            )}

            {/* Character Count */}
            {maxLength && (
                <Text style={[styles.characterCount, { fontSize: responsiveStyles.fontSize * 0.75 }]}>
                    {value.length}/{maxLength}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: SPACING.md,
    },

    label: {
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },

    // Default input container
    defaultContainer: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadowLight,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    // Glass morphism input
    glassContainer: {
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

    // Minimal input (nearly borderless)
    minimalContainer: {
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.shadowLight,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },

    // Spiritual themed input with warm colors (original design)
    spiritualContainer: {
        backgroundColor: '#F8F7FF', // Original light purple/lavender background
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)', // Original border color
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },

    // Disabled state
    disabledContainer: {
        backgroundColor: COLORS.text.light,
        borderColor: COLORS.text.tertiary,
        opacity: 0.6,
    },

    disabledInput: {
        color: COLORS.text.tertiary,
    },

    // Error text
    errorText: {
        color: COLORS.error,
        fontWeight: FONTS.weight.medium,
        marginTop: SPACING.xs,
    },

    // Character count
    characterCount: {
        color: COLORS.text.tertiary,
        textAlign: 'right',
        marginTop: SPACING.xs,
    },
}); 