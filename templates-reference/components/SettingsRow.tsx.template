import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants';

interface SettingsRowProps {
    title: string;
    description?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    rightElement?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    showDivider?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
    title,
    description,
    value,
    onValueChange,
    rightElement,
    onPress,
    disabled = false,
    showDivider = true,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375;

    const renderContent = () => (
        <View style={[
            styles.container,
            {
                paddingVertical: isSmallScreen ? 16 : 20,
                paddingHorizontal: isSmallScreen ? 16 : 20,
            }
        ]}>
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.title,
                        {
                            fontSize: isSmallScreen ? 16 : 17,
                            fontWeight: '500',
                            opacity: disabled ? 0.5 : 1,
                        }
                    ]}
                >
                    {title}
                </Text>
                {description && (
                    <Text
                        style={[
                            styles.description,
                            {
                                fontSize: isSmallScreen ? 13 : 14,
                                opacity: disabled ? 0.4 : 1,
                            }
                        ]}
                    >
                        {description}
                    </Text>
                )}
            </View>

            <View style={styles.rightContent}>
                {rightElement ? (
                    rightElement
                ) : value !== undefined && onValueChange ? (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        trackColor={{
                            false: COLORS.surface.secondary,
                            true: COLORS.secondary + '80',
                        }}
                        thumbColor={value ? COLORS.secondary : COLORS.text.tertiary}
                        disabled={disabled}
                    />
                ) : null}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                style={[
                    styles.wrapper,
                    showDivider && styles.divider,
                ]}
            >
                {renderContent()}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[
            styles.wrapper,
            showDivider && styles.divider,
        ]}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginVertical: 4,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        color: COLORS.text.primary,
    },
    description: {
        color: COLORS.text.secondary,
        marginTop: 4,
        lineHeight: 18,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
}); 