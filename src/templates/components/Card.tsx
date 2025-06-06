import React from 'react';
import { View, ViewStyle, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../src/constants';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'elevated' | 'subtle';
    padding?: keyof typeof SPACING | number;
    margin?: keyof typeof SPACING | number;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'lg',
    margin = 'md',
    style,
}) => {
    const { width: screenWidth } = useWindowDimensions();

    // Responsive padding based on screen size
    const getPadding = () => {
        if (typeof padding === 'number') return padding;
        const basePadding = SPACING[padding];

        // Scale padding for larger screens (extracted from HeaderCard pattern)
        if (screenWidth >= 768) return basePadding * 1.6; // Tablet
        if (screenWidth >= 428) return basePadding * 1.2; // Large phones
        if (screenWidth <= 375) return basePadding * 0.8; // Small phones
        return basePadding;
    };

    const getMargin = () => {
        if (typeof margin === 'number') return margin;
        return SPACING[margin];
    };

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'glass':
                return styles.glassCard;
            case 'elevated':
                return styles.elevatedCard;
            case 'subtle':
                return styles.subtleCard;
            default:
                return styles.defaultCard;
        }
    };

    return (
        <View
            style={[
                styles.baseCard,
                getVariantStyles(),
                {
                    padding: getPadding(),
                    margin: getMargin(),
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    baseCard: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },

    // Default card with spiritual warmth
    defaultCard: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },

    // Glass morphism card (extracted from your design)
    glassCard: {
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

    // Elevated card for important content
    elevatedCard: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },

    // Subtle card for secondary content
    subtleCard: {
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
}); 