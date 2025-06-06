import React from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

interface OnboardingPageTemplateProps {
    children: React.ReactNode;
    contentStyle?: any;
}

export const OnboardingPageTemplate: React.FC<OnboardingPageTemplateProps> = ({
    children,
    contentStyle,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375 || screenHeight < 700;

    return (
        <View style={styles.fullContainer}>
            <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.fullBackground}
            >
                <SafeAreaView style={styles.container}>
                    <View style={[
                        styles.content,
                        {
                            paddingHorizontal: isSmallScreen ? 24 : 32,
                        },
                        contentStyle,
                    ]}>
                        {children}
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
    },
    fullBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
}); 