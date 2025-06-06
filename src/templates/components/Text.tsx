import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../src/constants';
import { useUniversalResponsive, getResponsiveFontSize } from '../utils/responsive';

interface TextProps {
    children: React.ReactNode;
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
    style?: TextStyle;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    selectable?: boolean;
    testID?: string;
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'md',
    weight = 'normal',
    color,
    style,
    numberOfLines,
    ellipsizeMode = 'tail',
    selectable = false,
    testID,
}) => {
    const deviceInfo = useUniversalResponsive();

    const getFontSize = () => {
        const baseSize = getResponsiveFontSize(16, deviceInfo); // 16px base font size

        switch (variant) {
            case 'xs': return baseSize * 0.75; // 12px base
            case 'sm': return baseSize * 0.875; // 14px base
            case 'md': return baseSize; // 16px base
            case 'lg': return baseSize * 1.125; // 18px base
            case 'xl': return baseSize * 1.25; // 20px base
            case '2xl': return baseSize * 1.5; // 24px base
            case '3xl': return baseSize * 1.875; // 30px base
            default: return baseSize;
        }
    };

    const getFontWeight = (): TextStyle['fontWeight'] => {
        switch (weight) {
            case 'normal': return '400';
            case 'medium': return '500';
            case 'semibold': return '600';
            case 'bold': return '700';
            default: return '400';
        }
    };

    const getLineHeight = () => {
        const fontSize = getFontSize();
        // Good line height ratio for readability
        return fontSize * 1.4;
    };

    const textStyle: TextStyle = {
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        lineHeight: getLineHeight(),
        color: color || COLORS.text.primary,
        fontFamily: FONTS.family.primary,
    };

    return (
        <RNText
            style={[textStyle, style]}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            selectable={selectable}
            testID={testID}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    // Base styles can be added here if needed
}); 