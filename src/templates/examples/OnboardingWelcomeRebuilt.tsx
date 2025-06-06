import React from 'react';
import { View, StyleSheet, useWindowDimensions, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../src/constants';

interface OnboardingWelcomeRebuiltProps {
    onNext: () => void;
}

export const OnboardingWelcomeRebuilt: React.FC<OnboardingWelcomeRebuiltProps> = ({
    onNext
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
                        }
                    ]}>
                        <View style={styles.textContainer}>
                            <Text
                                style={[
                                    styles.heading,
                                    {
                                        fontSize: isSmallScreen ? FONTS.size['3xl'] : FONTS.size['4xl'],
                                        marginBottom: isSmallScreen ? 16 : 24,
                                        lineHeight: isSmallScreen ? 36 : 44,
                                    }
                                ]}
                                accessibilityRole="header"
                            >
                                Welcome to Golden Threads
                            </Text>

                            <Text style={[
                                styles.subtitle,
                                {
                                    fontSize: isSmallScreen ? FONTS.size.lg : FONTS.size.xl,
                                    lineHeight: isSmallScreen ? 24 : 28,
                                }
                            ]}>
                                Discover wisdom that transcends traditions and integrate it into your life.
                            </Text>
                        </View>

                        <View style={[
                            styles.buttonContainer,
                            { marginBottom: isSmallScreen ? 64 : 80 }
                        ]}>
                            <TouchableOpacity
                                style={styles.beginButton}
                                onPress={onNext}
                                activeOpacity={0.8}
                                accessibilityLabel="Begin your spiritual journey"
                                accessibilityHint="Start the onboarding process"
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.button}
                                    style={[
                                        styles.buttonGradient,
                                        {
                                            paddingVertical: isSmallScreen ? 16 : 20,
                                            paddingHorizontal: isSmallScreen ? 24 : 32,
                                        }
                                    ]}
                                >
                                    <Text style={styles.buttonText}>Begin</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
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
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 64,
    },
    heading: {
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontWeight: FONTS.weight.normal,
        color: COLORS.text.secondary,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    beginButton: {
        width: 'auto',
        minWidth: 120,
        maxWidth: 200,
        borderRadius: 16,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignSelf: 'center',
    },
    buttonGradient: {
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    buttonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.white,
    },
}); 