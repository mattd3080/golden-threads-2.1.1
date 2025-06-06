import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';

interface TemplateLink {
    id: string;
    title: string;
    description: string;
    route: string;
    color: string;
}

/**
 * TemplateGallery - Design Templates Showcase
 * 
 * A simple gallery page that provides links to all design templates.
 * Perfect for reviewing and navigating between different template designs.
 */
export const TemplateGallery: React.FC = () => {
    const { spacing: responsiveSpacing, fonts: responsiveFonts, dimensions: responsiveDimensions, isTablet } = useResponsiveStyles();

    const templateLinks: TemplateLink[] = [
        {
            id: 'main-page',
            title: 'Main Page Preview',
            description: 'Complete main screen with quote card, reflection prompts, and spiritual wisdom',
            route: '/preview',
            color: COLORS.primary,
        },
        {
            id: 'notifications',
            title: 'Notifications Template',
            description: 'Notification settings with toggles, time pickers, and peaceful reminders',
            route: '/notifications-template',
            color: COLORS.secondary,
        },
        {
            id: 'onboarding',
            title: 'Onboarding Simple',
            description: 'Clean onboarding flow with spiritual tradition selection',
            route: '/onboarding-simple',
            color: COLORS.traditions.Sufism.primary,
        },
        {
            id: 'reflection',
            title: 'Reflection Complete Preview',
            description: 'Post-reflection completion screen with beautiful success states',
            route: '/reflection-preview',
            color: COLORS.traditions.Christian.primary,
        },
        {
            id: 'traditions',
            title: 'Spiritual Traditions Rebuilt',
            description: 'Tradition selection with elegant card-based interface',
            route: '/traditions-rebuilt',
            color: COLORS.traditions.Buddhist.primary,
        },
    ];

    const handleTemplatePress = (route: string) => {
        console.log('🎨 Template Gallery: Navigating to', route);
        if (Platform.OS === 'web') {
            window.location.href = route;
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: responsiveDimensions.contentPadding,
            paddingVertical: responsiveSpacing.xl,
        },
        header: {
            alignItems: 'center',
            marginBottom: responsiveSpacing['2xl'],
        },
        headerCard: {
            backgroundColor: COLORS.glassStrong,
            borderRadius: BORDER_RADIUS['3xl'],
            padding: responsiveDimensions.cardPadding,
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: isTablet ? 12 : 8 },
            shadowOpacity: 0.1,
            shadowRadius: isTablet ? 32 : 24,
            elevation: isTablet ? 12 : 8,
            alignItems: 'center',
            maxWidth: isTablet ? 600 : undefined,
        },
        title: {
            fontSize: responsiveFonts['4xl'],
            fontWeight: FONTS.weight.light,
            color: COLORS.text.primary,
            textAlign: 'center',
            marginBottom: responsiveSpacing.sm,
            letterSpacing: isTablet ? 2 : 1,
        },
        subtitle: {
            fontSize: responsiveFonts.lg,
            color: COLORS.text.secondary,
            textAlign: 'center',
            lineHeight: responsiveFonts.lg * FONTS.lineHeight.relaxed,
        },
        templatesGrid: {
            gap: responsiveSpacing.lg,
            maxWidth: isTablet ? 800 : undefined,
            alignSelf: 'center',
            width: '100%',
        },
        templateCard: {
            borderRadius: BORDER_RADIUS['3xl'],
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
            overflow: 'hidden',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: isTablet ? 8 : 6 },
            shadowOpacity: 0.12,
            shadowRadius: isTablet ? 20 : 16,
            elevation: isTablet ? 6 : 4,
        },
        templateCardGradient: {
            padding: responsiveDimensions.cardPadding,
        },
        templateHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: responsiveSpacing.md,
        },
        templateIcon: {
            width: isTablet ? 48 : 40,
            height: isTablet ? 48 : 40,
            borderRadius: BORDER_RADIUS.xl,
            marginRight: responsiveSpacing.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        templateIconText: {
            fontSize: responsiveFonts.lg,
            fontWeight: FONTS.weight.bold,
            color: COLORS.text.white,
        },
        templateInfo: {
            flex: 1,
        },
        templateTitle: {
            fontSize: responsiveFonts['2xl'],
            fontWeight: FONTS.weight.semibold,
            color: COLORS.text.primary,
            marginBottom: 4,
        },
        templateDescription: {
            fontSize: responsiveFonts.base,
            color: COLORS.text.secondary,
            lineHeight: responsiveFonts.base * FONTS.lineHeight.relaxed,
        },
        chevron: {
            fontSize: responsiveFonts.xl,
            fontWeight: FONTS.weight.medium,
            color: COLORS.text.tertiary,
        },
        footer: {
            alignItems: 'center',
            marginTop: responsiveSpacing['2xl'],
            paddingTop: responsiveSpacing.xl,
        },
        footerText: {
            fontSize: responsiveFonts.sm,
            color: COLORS.text.tertiary,
            textAlign: 'center',
        },
        footerDots: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveSpacing.sm,
            marginTop: responsiveSpacing.md,
        },
        footerDot: {
            width: isTablet ? 6 : 4,
            height: isTablet ? 6 : 4,
            borderRadius: BORDER_RADIUS.full,
            backgroundColor: COLORS.text.tertiary,
        },
        footerDotCenter: {
            width: isTablet ? 12 : 8,
            height: isTablet ? 12 : 8,
            backgroundColor: COLORS.text.secondary,
        },
    });

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={COLORS.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={Platform.OS !== 'web'}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerCard}>
                            <Text style={styles.title}>Template Gallery</Text>
                            <Text style={styles.subtitle}>
                                Explore our beautifully crafted design templates.{'\n'}
                                Each template showcases the complete design system.
                            </Text>
                        </View>
                    </View>

                    {/* Templates Grid */}
                    <View style={styles.templatesGrid}>
                        {templateLinks.map((template, index) => (
                            <TouchableOpacity
                                key={template.id}
                                style={styles.templateCard}
                                onPress={() => handleTemplatePress(template.route)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[COLORS.glassStrong, COLORS.glass]}
                                    style={styles.templateCardGradient}
                                >
                                    <View style={styles.templateHeader}>
                                        <View style={[
                                            styles.templateIcon,
                                            { backgroundColor: template.color }
                                        ]}>
                                            <Text style={styles.templateIconText}>
                                                {(index + 1).toString()}
                                            </Text>
                                        </View>
                                        <View style={styles.templateInfo}>
                                            <Text style={styles.templateTitle}>
                                                {template.title}
                                            </Text>
                                            <Text style={styles.templateDescription}>
                                                {template.description}
                                            </Text>
                                        </View>
                                        <Text style={styles.chevron}>›</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Golden Threads Design System
                        </Text>
                        <View style={styles.footerDots}>
                            <View style={styles.footerDot} />
                            <View style={[styles.footerDot, styles.footerDotCenter]} />
                            <View style={styles.footerDot} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}; 