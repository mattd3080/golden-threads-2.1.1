import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { Text } from './Text';
import { COLORS } from '../constants';

interface Feature {
    title: string;
    description: string;
}

interface AnimatedFeatureListProps {
    features: Feature[];
    startAnimation?: boolean;
}

export const AnimatedFeatureList: React.FC<AnimatedFeatureListProps> = ({
    features,
    startAnimation = true,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375;

    const animationValues = useRef(
        features.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        if (startAnimation) {
            const animations = animationValues.map((value, index) =>
                Animated.timing(value, {
                    toValue: 1,
                    duration: 600,
                    delay: index * 200,
                    useNativeDriver: true,
                })
            );

            Animated.stagger(100, animations).start();
        }
    }, [startAnimation]);

    return (
        <View style={styles.container}>
            {features.map((feature, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.featureItem,
                        {
                            opacity: animationValues[index],
                            transform: [
                                {
                                    translateY: animationValues[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.bulletContainer}>
                        <View style={styles.bullet} />
                    </View>
                    <View style={[
                        styles.textContainer,
                        { marginLeft: isSmallScreen ? 12 : 16 }
                    ]}>
                        <Text
                            variant="lg"
                            weight="semibold"
                            style={[styles.title, { fontSize: isSmallScreen ? 16 : 18 }]}
                        >
                            {feature.title}
                        </Text>
                        <Text
                            variant="md"
                            style={[
                                styles.description,
                                {
                                    fontSize: isSmallScreen ? 14 : 16,
                                    marginTop: isSmallScreen ? 4 : 6,
                                }
                            ]}
                        >
                            {feature.description}
                        </Text>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletContainer: {
        paddingTop: 4,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.secondary,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.text.primary,
    },
    description: {
        color: COLORS.text.secondary,
        lineHeight: 22,
    },
}); 