import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../src/constants';

interface TemplateLink {
    id: string;
    title: string;
    description: string;
    path: string;
    category: 'onboarding' | 'main-app' | 'preview';
    status: 'ready' | 'new';
}

const TEMPLATE_LINKS: TemplateLink[] = [
    // Onboarding Templates
    {
        id: 'welcome',
        title: 'Welcome Page',
        description: 'Fixed welcome page with correct dark text colors and proper styling',
        path: '/onboarding-welcome',
        category: 'onboarding',
        status: 'ready'
    },
    {
        id: 'traditions',
        title: 'Traditions Selection',
        description: 'Glass morphism cards with proper selection states and validation',
        path: '/onboarding-traditions',
        category: 'onboarding',
        status: 'ready'
    },
    {
        id: 'features',
        title: 'Features Overview',
        description: 'Correct copy and smooth animations with proper button styling',
        path: '/onboarding-features',
        category: 'onboarding',
        status: 'ready'
    },
    {
        id: 'notifications-onboarding',
        title: 'Notifications Setup',
        description: 'iOS-style time picker with clean interface (onboarding version)',
        path: '/onboarding-notifications',
        category: 'onboarding',
        status: 'ready'
    },

    // Main App Templates
    {
        id: 'notifications-main',
        title: 'Main Notifications Page',
        description: '100% identical to production notifications page with template architecture',
        path: '/notifications-template',
        category: 'main-app',
        status: 'new'
    },
    {
        id: 'spiritual-traditions',
        title: 'Spiritual Traditions',
        description: 'Interactive traditions explorer with beautiful cards and detailed info',
        path: '/traditions-rebuilt',
        category: 'main-app',
        status: 'ready'
    },

    // Preview Templates
    {
        id: 'main-page',
        title: 'Main Page Preview',
        description: 'Homepage template with clean design patterns',
        path: '/preview',
        category: 'preview',
        status: 'ready'
    },
    {
        id: 'reflection-complete',
        title: 'Reflection Complete',
        description: 'Post-reflection experience with celebration UI',
        path: '/reflection-preview',
        category: 'preview',
        status: 'ready'
    }
];

export const TemplateShowcase: React.FC = () => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const isSmallScreen = screenWidth < 375 || screenHeight < 700;
    const styles = createStyles(isSmallScreen);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredTemplates = selectedCategory === 'all'
        ? TEMPLATE_LINKS
        : TEMPLATE_LINKS.filter(template => template.category === selectedCategory);

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'new': return COLORS.success;
            case 'ready': return COLORS.secondary;
            default: return COLORS.text.tertiary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'new': return 'NEW';
            case 'ready': return 'READY';
            default: return 'DRAFT';
        }
    };

    const handleTemplatePress = (path: string) => {
        // Open in new tab/window for web
        if (typeof window !== 'undefined') {
            window.open(path, '_blank');
        }
    };

    const categories = [
        { id: 'all', label: 'All Templates', count: TEMPLATE_LINKS.length },
        { id: 'onboarding', label: 'Onboarding', count: TEMPLATE_LINKS.filter(t => t.category === 'onboarding').length },
        { id: 'main-app', label: 'Main App', count: TEMPLATE_LINKS.filter(t => t.category === 'main-app').length },
        { id: 'preview', label: 'Previews', count: TEMPLATE_LINKS.filter(t => t.category === 'preview').length },
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
                                Golden Threads
                            </Text>
                            <Text style={styles.subheading}>
                                Template Showcase
                            </Text>
                            <Text style={styles.description}>
                                Explore all the beautifully crafted templates we've built. Each one follows our design system and is production-ready.
                            </Text>
                        </View>

                        {/* Category Filter */}
                        <View style={styles.filterContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterScrollContent}
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.filterButton,
                                            selectedCategory === category.id && styles.filterButtonActive
                                        ]}
                                        onPress={() => setSelectedCategory(category.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.filterButtonText,
                                            selectedCategory === category.id && styles.filterButtonTextActive
                                        ]}>
                                            {category.label} ({category.count})
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Templates Grid */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {filteredTemplates.map((template) => (
                                <TouchableOpacity
                                    key={template.id}
                                    style={styles.templateCard}
                                    onPress={() => handleTemplatePress(template.path)}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={[COLORS.glassStrong, COLORS.glass]}
                                        style={styles.cardGradient}
                                    >
                                        <View style={styles.cardHeader}>
                                            <View style={styles.cardTitleContainer}>
                                                <Text style={styles.cardTitle}>{template.title}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor(template.status) }]}>
                                                    <Text style={styles.statusText}>{getStatusText(template.status)}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.cardCategory}>{template.category.replace('-', ' ').toUpperCase()}</Text>
                                        </View>

                                        <Text style={styles.cardDescription}>
                                            {template.description}
                                        </Text>

                                        <View style={styles.cardFooter}>
                                            <Text style={styles.cardPath}>{template.path}</Text>
                                            <View style={styles.cardArrow}>
                                                <Text style={styles.arrowText}>→</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Footer Info */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                🎨 Built with our modular design system
                            </Text>
                            <Text style={styles.footerSubtext}>
                                Each template is 100% production ready and follows Golden Threads design principles
                            </Text>
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
        fontSize: isSmallScreen ? FONTS.size['3xl'] : FONTS.size['4xl'],
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subheading: {
        fontSize: isSmallScreen ? FONTS.size.xl : FONTS.size['2xl'],
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.secondary,
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: isSmallScreen ? FONTS.size.sm : FONTS.size.base,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: isSmallScreen ? 20 : 24,
        paddingHorizontal: 16,
    },
    filterContainer: {
        marginVertical: 20,
    },
    filterScrollContent: {
        paddingHorizontal: 4,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    filterButtonActive: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    filterButtonText: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
    },
    filterButtonTextActive: {
        color: COLORS.text.white,
        fontWeight: FONTS.weight.semibold,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    templateCard: {
        marginBottom: 16,
        borderRadius: 16,
    },
    cardGradient: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    cardHeader: {
        marginBottom: 12,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
    },
    statusText: {
        fontSize: FONTS.size.xs,
        fontWeight: FONTS.weight.bold,
        color: COLORS.text.white,
    },
    cardCategory: {
        fontSize: FONTS.size.xs,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.tertiary,
        letterSpacing: 0.5,
    },
    cardDescription: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
        lineHeight: 18,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardPath: {
        fontSize: FONTS.size.xs,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.tertiary,
        flex: 1,
    },
    cardArrow: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowText: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.medium,
        color: COLORS.secondary,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.glassBorder,
        marginTop: 20,
    },
    footerText: {
        fontSize: FONTS.size.sm,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: FONTS.size.xs,
        fontWeight: FONTS.weight.medium,
        color: COLORS.text.secondary,
        textAlign: 'center',
    },
}); 