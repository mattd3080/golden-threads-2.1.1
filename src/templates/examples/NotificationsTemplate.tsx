import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Platform,
    Animated,
    Modal,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PageLayout } from '../../src/components/layout';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

interface NotificationSettings {
    dailyWisdom: {
        enabled: boolean;
        time: Date;
    };
    intentionReminder: {
        enabled: boolean;
        time: Date;
    };
    reflectionReminder: {
        enabled: boolean;
        time: Date;
    };
}

interface SettingSectionProps {
    title: string;
    description: string;
    enabled: boolean;
    time: Date;
    onToggle: (enabled: boolean) => void;
    onTimeChange: (time: Date) => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({
    title,
    description,
    enabled,
    time,
    onToggle,
    onTimeChange,
}) => {
    const showTimePicker = false; // Design-only: always hidden
    const { spacing: responsiveSpacing, fonts: responsiveFonts, dimensions: responsiveDimensions, isTablet } = useResponsiveStyles();

    // Create styles inside component to access responsive variables
    const styles = StyleSheet.create({
        settingSection: {
            marginBottom: responsiveSpacing.lg,
        },
        settingCard: {
            backgroundColor: COLORS.glassStrong,
            borderRadius: BORDER_RADIUS.xl,
            padding: responsiveDimensions.cardPadding,
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: isTablet ? 8 : 6 },
            shadowOpacity: 0.12,
            shadowRadius: isTablet ? 20 : 16,
            elevation: isTablet ? 6 : 4,
        },
        toggleSection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        settingInfo: {
            flex: 1,
        },
        settingTitle: {
            fontSize: responsiveFonts.lg,
            fontWeight: FONTS.weight.semibold,
            color: COLORS.text.primary,
        },
        settingDescription: {
            fontSize: responsiveFonts.sm,
            color: COLORS.text.secondary,
            marginTop: 2,
            lineHeight: responsiveFonts.sm * FONTS.lineHeight.normal,
        },
        timeSection: {
            marginTop: responsiveSpacing.sm,
        },
        timeButton: {
            backgroundColor: COLORS.glassStrong,
            borderRadius: BORDER_RADIUS.lg,
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
            overflow: 'hidden',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        timeButtonGradient: {
            flex: 1,
            padding: responsiveSpacing.md,
        },
        timeDisplay: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeText: {
            fontSize: responsiveFonts.lg,
            fontWeight: FONTS.weight.semibold,
            color: COLORS.text.primary,
            flex: 1,
            textAlign: 'center',
        },
        timeChevronContainer: {
            position: 'absolute',
            right: 0,
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeChevron: {
            fontSize: responsiveFonts.xl,
            fontWeight: FONTS.weight.medium,
            color: COLORS.secondary,
            transform: [{ rotate: '0deg' }],
        },
    });

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Design-only handlers (no functionality)
    const handleTimePress = () => {
        console.log('🎨 Time picker pressed (design only)');
    };

    const handleTimeConfirm = (selectedTime: Date) => {
        console.log('🎨 Time confirmed (design only):', selectedTime);
    };

    const handleTimeCancel = () => {
        console.log('🎨 Time picker cancelled (design only)');
    };

    const handleToggle = (value: boolean) => {
        onToggle(value);
    };

    return (
        <View style={styles.settingSection}>
            <View style={styles.settingCard}>
                <View style={styles.toggleSection}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>{title}</Text>
                        <Text style={styles.settingDescription}>{description}</Text>
                    </View>

                    <Switch
                        value={enabled}
                        onValueChange={handleToggle}
                        trackColor={{
                            false: COLORS.text.tertiary,
                            true: COLORS.secondary,
                        }}
                        thumbColor={enabled ? '#E5E7EB' : COLORS.text.light}
                        ios_backgroundColor={COLORS.text.tertiary}
                    />
                </View>

                {/* Time Selection */}
                {enabled && (
                    <View style={styles.timeSection}>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={handleTimePress}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[COLORS.glassStrong, COLORS.glass]}
                                style={styles.timeButtonGradient}
                            >
                                <View style={styles.timeDisplay}>
                                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                                    <View style={styles.timeChevronContainer}>
                                        <Text style={styles.timeChevron}>›</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Time Picker Modal */}
            {showTimePicker && (
                <IOSStyleTimePicker
                    time={time}
                    onConfirm={handleTimeConfirm}
                    onCancel={handleTimeCancel}
                />
            )}
        </View>
    );
};

// iOS-Style Time Picker Component (Design-only)
const IOSStyleTimePicker: React.FC<{
    time: Date;
    onConfirm: (time: Date) => void;
    onCancel: () => void;
}> = ({ time, onConfirm, onCancel }) => {
    // Static design values (no state management)
    const convert24to12Hour = (hour24: number) => {
        if (hour24 === 0) return { hour12: 12, period: 'AM' };
        if (hour24 < 12) return { hour12: hour24, period: 'AM' };
        if (hour24 === 12) return { hour12: 12, period: 'PM' };
        return { hour12: hour24 - 12, period: 'PM' };
    };

    const { hour12, period } = convert24to12Hour(time.getHours());
    const currentHour = hour12;
    const currentMinute = time.getMinutes();
    const currentPeriod = period;

    const getHours = () => Array.from({ length: 12 }, (_, i) => i + 1);
    const getMinutes = () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const getPeriods = () => ['AM', 'PM'];

    const handleConfirm = () => {
        const hour24 = currentPeriod === 'AM'
            ? (currentHour === 12 ? 0 : currentHour)
            : (currentHour === 12 ? 12 : currentHour + 12);

        const newTime = new Date(time);
        newTime.setHours(hour24, currentMinute, 0, 0);
        onConfirm(newTime);
    };

    const handleCancel = () => {
        onCancel();
    };

    // Design-only handler (no functionality)
    const handleValueChange = (value: number | string, type: 'hour' | 'minute' | 'period') => {
        console.log('🎨 Time picker value changed (design only):', { value, type });
    };

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View style={timePickerStyles.overlay}>
                <Pressable style={timePickerStyles.backdrop} onPress={handleCancel} />
                <View style={timePickerStyles.modal}>
                    <View style={timePickerStyles.header}>
                        <TouchableOpacity onPress={handleCancel}>
                            <Text style={timePickerStyles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={timePickerStyles.title}>Select Time</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={timePickerStyles.confirmButton}>Done</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={timePickerStyles.pickerContainer}>
                        <View style={timePickerStyles.picker}>
                            <ScrollView contentContainerStyle={timePickerStyles.scrollContainer}>
                                {getHours().map(hour => (
                                    <TouchableOpacity
                                        key={hour}
                                        style={[
                                            timePickerStyles.pickerItem,
                                            currentHour === hour && timePickerStyles.selectedItem,
                                        ]}
                                        onPress={() => handleValueChange(hour, 'hour')}
                                    >
                                        <Text style={[
                                            timePickerStyles.pickerText,
                                            currentHour === hour && timePickerStyles.selectedText,
                                        ]}>
                                            {hour}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <Text style={timePickerStyles.separator}>:</Text>
                        <View style={timePickerStyles.picker}>
                            <ScrollView contentContainerStyle={timePickerStyles.scrollContainer}>
                                {getMinutes().map(minute => (
                                    <TouchableOpacity
                                        key={minute}
                                        style={[
                                            timePickerStyles.pickerItem,
                                            currentMinute === parseInt(minute) && timePickerStyles.selectedItem,
                                        ]}
                                        onPress={() => handleValueChange(minute, 'minute')}
                                    >
                                        <Text style={[
                                            timePickerStyles.pickerText,
                                            currentMinute === parseInt(minute) && timePickerStyles.selectedText,
                                        ]}>
                                            {minute}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={timePickerStyles.picker}>
                            <ScrollView contentContainerStyle={timePickerStyles.scrollContainer}>
                                {getPeriods().map(period => (
                                    <TouchableOpacity
                                        key={period}
                                        style={[
                                            timePickerStyles.pickerItem,
                                            currentPeriod === period && timePickerStyles.selectedItem,
                                        ]}
                                        onPress={() => handleValueChange(period, 'period')}
                                    >
                                        <Text style={[
                                            timePickerStyles.pickerText,
                                            currentPeriod === period && timePickerStyles.selectedText,
                                        ]}>
                                            {period}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

/**
 * NotificationsTemplate - Pure Design Component
 * 
 * This is a design-only template showcasing the visual interface for notification settings.
 * All interactions (toggles, time pickers, menu) are non-functional and only log to console.
 * Perfect for demonstrating the design system and responsive layout.
 */
export const NotificationsTemplate: React.FC = () => {
    // Use responsive styles hook
    const { spacing: responsiveSpacing, fonts: responsiveFonts, dimensions: responsiveDimensions, isTablet } = useResponsiveStyles();

    // Create styles inside component to access responsive variables
    const styles = StyleSheet.create({
        // Main Container - Following design guide
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },

        // Introduction Section - Following design guide
        introSection: {
            marginBottom: responsiveSpacing.xl,
        },
        introCard: {
            backgroundColor: COLORS.glassStrong,
            alignItems: 'center',
            padding: responsiveDimensions.cardPadding,
            borderRadius: BORDER_RADIUS.xl,
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: isTablet ? 12 : 8 },
            shadowOpacity: 0.1,
            shadowRadius: isTablet ? 24 : 16,
            elevation: isTablet ? 8 : 4,
        },
        introTitle: {
            fontSize: responsiveFonts['3xl'], // Fixed 24px per design guide
            fontWeight: FONTS.weight.medium,
            color: COLORS.text.primary,
            marginBottom: responsiveSpacing.sm,
            textAlign: 'center',
        },
        introText: {
            fontSize: responsiveFonts.base,
            color: COLORS.text.secondary,
            textAlign: 'center',
            lineHeight: responsiveFonts.base * FONTS.lineHeight.relaxed,
        },
    });

    // Static design values (no state management)
    const settings = {
        dailyWisdom: {
            enabled: true,
            time: new Date(2025, 0, 1, 8, 0), // 8:00 AM - Default time
        },
        intentionReminder: {
            enabled: true,
            time: new Date(2025, 0, 1, 14, 0), // 2:00 PM - Default time
        },
        reflectionReminder: {
            enabled: true,
            time: new Date(2025, 0, 1, 17, 0), // 5:00 PM - Default time
        },
    };

    // Design-only handlers (no functionality)
    const handleDailyWisdomToggle = (enabled: boolean) => {
        console.log('🎨 Daily Wisdom toggle pressed (design only):', enabled);
    };

    const handleDailyWisdomTimeChange = (time: Date) => {
        console.log('🎨 Daily Wisdom time change pressed (design only):', time);
    };

    const handleIntentionToggle = (enabled: boolean) => {
        console.log('🎨 Intention toggle pressed (design only):', enabled);
    };

    const handleIntentionTimeChange = (time: Date) => {
        console.log('🎨 Intention time change pressed (design only):', time);
    };

    const handleReflectionToggle = (enabled: boolean) => {
        console.log('🎨 Reflection toggle pressed (design only):', enabled);
    };

    const handleReflectionTimeChange = (time: Date) => {
        console.log('🎨 Reflection time change pressed (design only):', time);
    };

    // Design-only menu handler (no functionality)
    const handleMenuPress = () => {
        console.log('🎨 NotificationsTemplate: Menu pressed (design only)');
    };

    return (
        <View style={styles.container}>
            <PageLayout
                title="Notifications"
                showMenuButton={true}
                onMenuPress={handleMenuPress}
            >
                {/* Introduction */}
                <View style={styles.introSection}>
                    <View style={styles.introCard}>
                        <Text style={styles.introTitle}>Gentle Daily Reminders</Text>
                        <Text style={styles.introText}>
                            Set up peaceful notifications to enhance your spiritual practice.
                            Choose times that work with your daily rhythm.
                        </Text>
                    </View>
                </View>

                {/* Daily Wisdom Settings */}
                <SettingSection
                    title="Daily Wisdom"
                    description="Receive today's spiritual quote via notification."
                    enabled={settings.dailyWisdom.enabled}
                    time={settings.dailyWisdom.time}
                    onToggle={handleDailyWisdomToggle}
                    onTimeChange={handleDailyWisdomTimeChange}
                />

                {/* Intention Reminder Settings */}
                <SettingSection
                    title="Intention Reminder"
                    description="Stay grounded in today's intention with a daily reminder of it."
                    enabled={settings.intentionReminder.enabled}
                    time={settings.intentionReminder.time}
                    onToggle={handleIntentionToggle}
                    onTimeChange={handleIntentionTimeChange}
                />

                {/* Reflection Reminder Settings */}
                <SettingSection
                    title="Reflection Reminder"
                    description="If you have forgotten to reflect today, enabling this will remind you to do so."
                    enabled={settings.reflectionReminder.enabled}
                    time={settings.reflectionReminder.time}
                    onToggle={handleReflectionToggle}
                    onTimeChange={handleReflectionTimeChange}
                />

            </PageLayout>
        </View>
    );
};

const timePickerStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    modal: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
    },
    cancelButton: {
        fontSize: FONTS.size.base,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
    },
    confirmButton: {
        fontSize: FONTS.size.base,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.secondary,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    picker: {
        width: 60,
        height: 150,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    pickerItem: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    selectedItem: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 8,
    },
    pickerText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
    },
    selectedText: {
        color: COLORS.primary,
        fontWeight: FONTS.weight.semibold,
    },
    separator: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.primary,
        marginHorizontal: 10,
    },
}); 