import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants';

interface OnboardingFeaturesRebuiltProps {
    onContinue: () => void;
}

const FEATURES = [
    'a lesson from a sacred text',
    'a journal prompt to help you integrate it',
    'an opportunity to set an intention for your day',
];

export const OnboardingFeaturesRebuilt: React.FC<OnboardingFeaturesRebuiltProps> = ({
    onContinue,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375 || screenHeight < 700;
    const styles = createStyles(isSmallScreen);
    const [showButton, setShowButton] = useState(false);

    // Animation values for each feature
    const fadeAnims = useRef(
        FEATURES.map(() => new Animated.Value(0))
    ).current;

    // Button animation
    const buttonFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start staggered animation sequence
        const animateFeatures = () => {
            FEATURES.forEach((_, index) => {
                // Consistent timing: 1000ms start, then 800ms intervals
                const delays = [1000, 1800, 2600]; // 1000ms, +800ms, +800ms
                const delay = delays[index];

                setTimeout(() => {
                    Animated.timing(fadeAnims[index], {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }).start(() => {
                        // Show button after last feature appears
                        if (index === FEATURES.length - 1) {
                            setTimeout(() => {
                                setShowButton(true);

                                // Animate button appearance
                                Animated.timing(buttonFadeAnim, {
                                    toValue: 1,
                                    duration: 400,
                                    useNativeDriver: true,
                                }).start();
                            }, 800); // +800ms delay for button (3400ms total)
                        }
                    });
                }, delay);
            });
        };

        animateFeatures();
    }, [fadeAnims, buttonFadeAnim]);

    return (
        <View style={styles.fullContainer}>
            <LinearGradient
                colors={COLORS.gradients.primary}
                style={styles.fullBackground}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.heading}>
                                Every day, Golden Threads will give you:
                            </Text>
                        </View>

                        {/* Features List */}
                        <View style={styles.featuresContainer}>
                            {FEATURES.map((feature, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.featureItem,
                                        {
                                            opacity: fadeAnims[index],
                                        },
                                    ]}
                                >
                                    <View style={styles.featureRow}>
                                        <View style={styles.bulletPoint} />
                                        <Text style={styles.featureText}>{feature}</Text>
                                    </View>
                                </Animated.View>
                            ))}
                        </View>

                        {/* Button */}
                        <Animated.View
                            style={[
                                styles.buttonContainer,
                                {
                                    opacity: buttonFadeAnim,
                                },
                            ]}
                        >
                            {showButton && (
                                <TouchableOpacity
                                    style={styles.onwardButton}
                                    onPress={onContinue}
                                    activeOpacity={0.8}
                                    accessibilityLabel="Continue to notifications setup"
                                    accessibilityHint="Proceed to the next step of onboarding"
                                >
                                    <LinearGradient
                                        colors={COLORS.gradients.button}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>Onward</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

const createStyles = (isSmallScreen: boolean) => StyleSheet.create({
    fullContainer: {
        flex: 1,
    },
    fullBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: isSmallScreen ? 24 : 32,
    },
    header: {
        marginBottom: isSmallScreen ? 48 : 64,
    },
    heading: {
        fontSize: isSmallScreen ? FONTS.size['2xl'] : FONTS.size['3xl'],
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.primary,
        textAlign: 'center',
        lineHeight: isSmallScreen ? 30 : 36,
    },
    featuresContainer: {
        alignItems: 'center',
        marginBottom: isSmallScreen ? 48 : 64,
    },
    featureItem: {
        width: '100%',
        marginBottom: isSmallScreen ? 24 : 32,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        justifyContent: 'flex-start',
    },
    bulletPoint: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginTop: isSmallScreen ? 8 : 10, // Align with first line of text
        marginRight: 16,
        flexShrink: 0,
    },
    featureText: {
        flex: 1,
        fontSize: isSmallScreen ? FONTS.size.lg : FONTS.size.xl,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.primary,
        lineHeight: isSmallScreen ? 24 : 28,
    },
    buttonContainer: {
        alignItems: 'center',
        minHeight: isSmallScreen ? 56 : 64, // Reserve space for button to prevent layout shift
        justifyContent: 'center',
    },
    onwardButton: {
        width: '80%',
        maxWidth: 300,
        borderRadius: 16,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonGradient: {
        paddingVertical: isSmallScreen ? 16 : 20,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.white,
    },
}); 