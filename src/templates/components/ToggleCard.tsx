import React from 'react';
import { TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { Checkbox } from './Checkbox';
import { COLORS } from '../constants';

interface ToggleCardProps {
    title: string;
    isSelected: boolean;
    onToggle: () => void;
    style?: any;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
    title,
    isSelected,
    onToggle,
    style,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375;

    return (
        <TouchableOpacity
            onPress={onToggle}
            style={[styles.container, style]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.8)']}
                style={[
                    styles.gradient,
                    {
                        padding: isSmallScreen ? 14 : 18,
                        minHeight: isSmallScreen ? 80 : 90,
                    }
                ]}
            >
                <Text
                    variant="md"
                    weight="medium"
                    style={[
                        styles.title,
                        {
                            fontSize: isSmallScreen ? 14 : 16,
                        }
                    ]}
                    numberOfLines={2}
                >
                    {title}
                </Text>

                <Checkbox
                    checked={isSelected}
                    onPress={onToggle}
                    style={styles.checkbox}
                    size={isSmallScreen ? 18 : 20}
                />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 0,
    },
    gradient: {
        borderRadius: 12,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        color: COLORS.text.primary,
        textAlign: 'left',
        lineHeight: 20,
        flex: 1,
    },
    checkbox: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
}); 