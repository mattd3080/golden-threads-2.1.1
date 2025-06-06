import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Switch,
    useWindowDimensions,
    Platform,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants';

interface OnboardingNotificationsRebuiltProps {
    onComplete: (notificationsEnabled: boolean) => void;
}

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

const DEFAULT_SETTINGS: NotificationSettings = {
    dailyWisdom: {
        enabled: true,
        time: new Date(2025, 0, 1, 8, 0), // 8:00 AM
    },
    intentionReminder: {
        enabled: true,
        time: new Date(2025, 0, 1, 14, 0), // 2:00 PM
    },
    reflectionReminder: {
        enabled: true,
        time: new Date(2025, 0, 1, 17, 0), // 5:00 PM
    },
};

// iOS-Style Time Picker Component
const IOSStyleTimePicker: React.FC<{
    time: Date;
    onConfirm: (time: Date) => void;
    onCancel: () => void;
}> = ({ time, onConfirm, onCancel }) => {
    const [selectedTime, setSelectedTime] = useState(time);

    const convert24to12Hour = (hour24: number) => {
        if (hour24 === 0) return 12;
        if (hour24 <= 12) return hour24;
        return hour24 - 12;
    };

    const getHours = () => Array.from({ length: 12 }, (_, i) => i + 1);
    const getMinutes = () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const getPeriods = () => ['AM', 'PM'];

    const handleConfirm = () => {
        onConfirm(selectedTime);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleValueChange = (value: number | string, type: 'hour' | 'minute' | 'period') => {
        const newTime = new Date(selectedTime);

        if (type === 'hour') {
            const hour24 = selectedTime.getHours();
            const isPM = hour24 >= 12;
            const newHour24 = isPM ? (value === 12 ? 12 : Number(value) + 12) : (value === 12 ? 0 : Number(value));
            newTime.setHours(newHour24);
        } else if (type === 'minute') {
            newTime.setMinutes(Number(value));
        } else if (type === 'period') {
            const currentHour = newTime.getHours();
            if (value === 'AM' && currentHour >= 12) {
                newTime.setHours(currentHour - 12);
            } else if (value === 'PM' && currentHour < 12) {
                newTime.setHours(currentHour + 12);
            }
        }

        setSelectedTime(newTime);
    };

    const currentHour12 = convert24to12Hour(selectedTime.getHours());
    const currentMinute = selectedTime.getMinutes().toString().padStart(2, '0');
    const currentPeriod = selectedTime.getHours() >= 12 ? 'PM' : 'AM';

    return (
        <Modal visible={true} transparent animationType="slide">
            <View style={timePickerStyles.overlay}>
                <TouchableOpacity
                    style={timePickerStyles.backdrop}
                    onPress={handleCancel}
                    activeOpacity={1}
                />
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
                                            currentHour12 === hour && timePickerStyles.selectedItem,
                                        ]}
                                        onPress={() => handleValueChange(hour, 'hour')}
                                    >
                                        <Text style={[
                                            timePickerStyles.pickerText,
                                            currentHour12 === hour && timePickerStyles.selectedText,
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
                                            currentMinute === minute && timePickerStyles.selectedItem,
                                        ]}
                                        onPress={() => handleValueChange(minute, 'minute')}
                                    >
                                        <Text style={[
                                            timePickerStyles.pickerText,
                                            currentMinute === minute && timePickerStyles.selectedText,
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

export const OnboardingNotificationsRebuilt: React.FC<OnboardingNotificationsRebuiltProps> = ({
    onComplete,
}) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375 || screenHeight < 700;
    const styles = createStyles(isSmallScreen);

    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTimeType, setSelectedTimeType] = useState<keyof NotificationSettings>('dailyWisdom');

    const handleToggleSetting = (settingType: keyof NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            [settingType]: {
                ...prev[settingType],
                enabled: !prev[settingType].enabled,
            },
        }));
    };

    const handleTimeChange = (settingType: keyof NotificationSettings, time: Date) => {
        setSettings(prev => ({
            ...prev,
            [settingType]: {
                ...prev[settingType],
                time: time,
            },
        }));
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleTimePress = (settingType: keyof NotificationSettings) => {
        setSelectedTimeType(settingType);
        setShowTimePicker(true);
    };

    const handleTimeConfirm = (time: Date) => {
        handleTimeChange(selectedTimeType, time);
        setShowTimePicker(false);
    };

    const handleTimeCancel = () => {
        setShowTimePicker(false);
    };

    const handleComplete = async () => {
        try {
            const hasEnabledNotifications = settings.dailyWisdom.enabled ||
                settings.intentionReminder.enabled ||
                settings.reflectionReminder.enabled;

            if (hasEnabledNotifications) {
                // In real implementation would request permission here
                console.log('Would request notification permission and save settings');
            }

            onComplete(hasEnabledNotifications);
        } catch (error) {
            console.error('Error completing notifications setup:', error);
            onComplete(false);
        }
    };

    // Notification settings array for rendering (using correct copy from main screen)
    const notificationSettings = [
        {
            key: 'dailyWisdom' as keyof NotificationSettings,
            title: 'Daily Wisdom',
            description: 'Receive today\'s spiritual quote via notification.',
            enabled: settings.dailyWisdom.enabled,
            time: settings.dailyWisdom.time,
        },
        {
            key: 'intentionReminder' as keyof NotificationSettings,
            title: 'Intention Reminder',
            description: 'Stay grounded in today\'s intention with a daily reminder of it.',
            enabled: settings.intentionReminder.enabled,
            time: settings.intentionReminder.time,
        },
        {
            key: 'reflectionReminder' as keyof NotificationSettings,
            title: 'Reflection Reminder',
            description: 'If you have forgotten to reflect today, enabling this will remind you to do so.',
            enabled: settings.reflectionReminder.enabled,
            time: settings.reflectionReminder.time,
        },
    ];

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
                                Gentle Daily Reminders
                            </Text>
                            <Text style={styles.subheading}>
                                Golden Threads works best when used with daily consistency. Use these notifications to stay grounded in your practice.
                            </Text>
                        </View>

                        {/* Notification Settings */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {notificationSettings.map((setting) => (
                                <View key={setting.key} style={styles.settingCard}>
                                    <LinearGradient
                                        colors={[COLORS.glassStrong, COLORS.glass]}
                                        style={styles.cardGradient}
                                    >
                                        <View style={styles.settingHeader}>
                                            <View style={styles.settingInfo}>
                                                <Text style={styles.settingTitle}>{setting.title}</Text>
                                                <Text style={styles.settingDescription}>{setting.description}</Text>
                                            </View>

                                            <Switch
                                                value={setting.enabled}
                                                onValueChange={() => handleToggleSetting(setting.key)}
                                                trackColor={{
                                                    false: COLORS.text.tertiary,
                                                    true: COLORS.secondary,
                                                }}
                                                thumbColor={setting.enabled ? '#E5E7EB' : COLORS.text.light}
                                                ios_backgroundColor={COLORS.text.tertiary}
                                            />
                                        </View>

                                        {/* Time Selection */}
                                        {setting.enabled && (
                                            <View style={styles.timeSection}>
                                                <TouchableOpacity
                                                    style={styles.timeButton}
                                                    onPress={() => handleTimePress(setting.key)}
                                                    activeOpacity={0.7}
                                                >
                                                    <LinearGradient
                                                        colors={[COLORS.glassStrong, COLORS.glass]}
                                                        style={styles.timeButtonGradient}
                                                    >
                                                        <View style={styles.timeDisplay}>
                                                            <Text style={styles.timeText}>{formatTime(setting.time)}</Text>
                                                            <View style={styles.timeChevronContainer}>
                                                                <Text style={styles.timeChevron}>›</Text>
                                                            </View>
                                                        </View>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </LinearGradient>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Start Practice Button */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleComplete}
                                activeOpacity={0.8}
                                accessibilityLabel="Start your spiritual practice"
                                accessibilityHint="Complete onboarding and begin using Golden Threads"
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.button}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>Start the Practice</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Time Picker Modal */}
            {showTimePicker && (
                <IOSStyleTimePicker
                    time={settings[selectedTimeType].time}
                    onConfirm={handleTimeConfirm}
                    onCancel={handleTimeCancel}
                />
            )}
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
        marginBottom: 12,
        lineHeight: isSmallScreen ? 30 : 36,
    },
    subheading: {
        fontSize: isSmallScreen ? FONTS.size.sm : FONTS.size.base,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary, // Correct gray color
        textAlign: 'center',
        lineHeight: isSmallScreen ? 20 : 24,
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    settingCard: {
        marginBottom: 16,
        borderRadius: 16,
    },
    cardGradient: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
        lineHeight: 18,
    },
    timeSection: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.glassBorder,
    },
    timeButton: {
        borderRadius: 12,
    },
    timeButtonGradient: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    timeText: {
        fontSize: FONTS.size.base,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.primary,
    },
    timeChevronContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeChevron: {
        fontSize: 18,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.tertiary,
    },
    buttonContainer: {
        paddingVertical: isSmallScreen ? 20 : 32,
        alignItems: 'center',
    },
    startButton: {
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
        paddingHorizontal: isSmallScreen ? 32 : 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 140,
    },
    buttonText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.white,
    },
});

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