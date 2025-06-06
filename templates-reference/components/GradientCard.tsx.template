import React from 'react';
import { View, ViewStyle, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, BORDER_RADIUS } from '../constants';

interface GradientCardProps {
    children: React.ReactNode;
    colors: string[];
    padding?: keyof typeof SPACING | number;
    margin?: keyof typeof SPACING | number;
    borderRadius?: keyof typeof BORDER_RADIUS | number;
    style?: ViewStyle;
}

export const GradientCard: React.FC<GradientCardProps> = ({
    children,
    colors,
    padding = 'lg',
    margin = 'md',
    borderRadius = 'xl',
    style,
}) => {
    const { width: screenWidth } = useWindowDimensions();

    // Responsive padding based on screen size
    const getPadding = () => {
        if (typeof padding === 'number') return padding;
        const basePadding = SPACING[padding];

        // Scale padding for larger screens
        if (screenWidth >= 768) return basePadding * 1.6; // Tablet
        if (screenWidth >= 428) return basePadding * 1.2; // Large phones
        if (screenWidth <= 375) return basePadding * 0.8; // Small phones
        return basePadding;
    };

    const getMargin = () => {
        if (typeof margin === 'number') return margin;
        return SPACING[margin];
    };

    const getBorderRadius = () => {
        if (typeof borderRadius === 'number') return borderRadius;
        return BORDER_RADIUS[borderRadius];
    };

    return (
        <View
            style={[
                {
                    margin: getMargin(),
                    borderRadius: getBorderRadius(),
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <LinearGradient
                colors={colors as any}
                style={[
                    styles.gradientContainer,
                    {
                        padding: getPadding(),
                        borderRadius: getBorderRadius(),
                    },
                ]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        borderWidth: 0.1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
}); 