import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSpiritualTraditions } from '../../src/hooks/useSpiritualTraditions';
import { COLORS, FONTS, SPACING } from '../../src/constants';

interface OnboardingTraditionsRebuiltProps {
    selectedTraditions: string[];
    onTraditionsChange: (traditions: string[]) => void;
    onContinue: () => void;
}

export const OnboardingTraditionsRebuilt: React.FC<OnboardingTraditionsRebuiltProps> = ({
    selectedTraditions,
    onTraditionsChange,
    onContinue,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375 || screenHeight < 700;
    const styles = createStyles(isSmallScreen);
    const { availableTraditions, isLoading } = useSpiritualTraditions();
    const [showValidationError, setShowValidationError] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);

    // Update isAllSelected when traditions change
    useEffect(() => {
        if (availableTraditions.length > 0) {
            const allSelected = availableTraditions.every(tradition =>
                selectedTraditions.includes(tradition.id)
            );
            setIsAllSelected(allSelected);
        }
    }, [selectedTraditions, availableTraditions]);

    // Clear validation error when traditions are selected
    useEffect(() => {
        if (selectedTraditions.length > 0) {
            setShowValidationError(false);
        }
    }, [selectedTraditions]);

    const handleTraditionToggle = (traditionId: string) => {
        const isSelected = selectedTraditions.includes(traditionId);
        let updatedTraditions: string[];

        if (isSelected) {
            updatedTraditions = selectedTraditions.filter(id => id !== traditionId);
        } else {
            updatedTraditions = [...selectedTraditions, traditionId];
        }

        onTraditionsChange(updatedTraditions);
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all
            onTraditionsChange([]);
        } else {
            // Select all
            const allTraditionIds = availableTraditions.map(tradition => tradition.id);
            onTraditionsChange(allTraditionIds);
        }
    };

    const handleContinue = () => {
        if (selectedTraditions.length === 0) {
            setShowValidationError(true);
            return;
        }
        onContinue();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient colors={COLORS.gradients.primary} style={styles.background}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading traditions...</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.fullContainer}>
            <LinearGradient colors={COLORS.gradients.primary} style={styles.fullBackground}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.heading}>
                                Which traditions speak to you or spark your curiosity?
                            </Text>
                        </View>

                        {/* Select All Button */}
                        <View style={styles.selectAllContainer}>
                            <TouchableOpacity
                                style={styles.selectAllButton}
                                onPress={handleSelectAll}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.selectAllText}>
                                    {isAllSelected ? 'Deselect All' : 'Select All'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Traditions List */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.traditionsGrid}>
                                {availableTraditions.map((tradition) => {
                                    const isSelected = selectedTraditions.includes(tradition.id);
                                    return (
                                        <TouchableOpacity
                                            key={tradition.id}
                                            style={[
                                                styles.traditionCard,
                                                isSelected && styles.traditionCardSelected,
                                            ]}
                                            onPress={() => handleTraditionToggle(tradition.id)}
                                            activeOpacity={0.8}
                                        >
                                            <LinearGradient
                                                colors={isSelected ? COLORS.gradients.button : [COLORS.glassStrong, COLORS.glass]}
                                                style={styles.traditionCardGradient}
                                            >
                                                <Text
                                                    style={[
                                                        styles.traditionText,
                                                        isSelected && styles.traditionTextSelected,
                                                    ]}
                                                >
                                                    {tradition.name}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Continue Button */}
                        <View style={styles.bottomSection}>
                            {showValidationError && (
                                <Text style={styles.validationError}>
                                    Please select at least one tradition to move forward.
                                </Text>
                            )}

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.button}
                                    style={styles.continueButtonGradient}
                                >
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
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
        paddingHorizontal: isSmallScreen ? 20 : 24,
    },
    header: {
        paddingTop: isSmallScreen ? 20 : 32,
        paddingBottom: isSmallScreen ? 16 : 24,
        alignItems: 'center',
    },
    heading: {
        fontSize: isSmallScreen ? FONTS.size['2xl'] : FONTS.size['3xl'],
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.primary, // Correct dark color
        textAlign: 'center',
        lineHeight: isSmallScreen ? 30 : 36,
    },
    selectAllContainer: {
        alignItems: 'center',
        marginBottom: isSmallScreen ? 16 : 24,
    },
    selectAllButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    selectAllText: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    traditionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    traditionCard: {
        marginBottom: 12,
        borderRadius: 16,
    },
    traditionCardSelected: {
        // Additional selected styling handled by gradient
    },
    traditionCardGradient: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        minWidth: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    traditionText: {
        fontSize: isSmallScreen ? FONTS.size.sm : FONTS.size.base,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.primary,
        textAlign: 'center',
    },
    traditionTextSelected: {
        color: COLORS.text.white,
        fontWeight: FONTS.weight.semibold,
    },
    bottomSection: {
        paddingTop: 20,
        paddingBottom: isSmallScreen ? 20 : 32,
        alignItems: 'center',
    },
    validationError: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.medium,
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    continueButton: {
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
    continueButtonGradient: {
        paddingVertical: isSmallScreen ? 16 : 20,
        paddingHorizontal: isSmallScreen ? 32 : 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    continueButtonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
    },
}); 