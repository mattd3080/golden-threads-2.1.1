import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PageLayout } from '../components/layout';
import { Card, Button, Input } from '../components';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { MenuModal } from '../components/modals/MenuModal';

interface SaveState {
    saving: boolean;
    saved: boolean;
    error: boolean;
    retryCount: number;
    lastSaved?: Date;
}

export const ReflectionCompletePreview = () => {
    const { spacing, fonts } = useResponsiveStyles();
    const [expandedReflection, setExpandedReflection] = useState(false);
    const [editingIntention, setEditingIntention] = useState(false);
    const [editingReflection, setEditingReflection] = useState(false);
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

    // Sample data matching original
    const [data, setData] = useState({
        intention: "Practice mindful presence throughout my day",
        quote: "The present moment is the only time over which we have dominion.",
        author: "Thích Nhất Hạnh",
        reflection: "Today I feel grateful for the quiet moments that allow me to pause and reflect. There's something beautiful about taking time to really notice what's happening around me and within me. I want to carry this sense of awareness with me as I move through the rest of my day.",
    });

    const [tempIntention, setTempIntention] = useState(data.intention);
    const [tempReflection, setTempReflection] = useState(data.reflection);

    const [intentionSaveState, setIntentionSaveState] = useState<SaveState>({
        saving: false, saved: false, error: false, retryCount: 0,
    });

    const [reflectionSaveState, setReflectionSaveState] = useState<SaveState>({
        saving: false, saved: false, error: false, retryCount: 0,
    });

    // Hamburger menu handlers
    const openHamburgerMenu = () => setShowHamburgerMenu(true);
    const closeHamburgerMenu = () => setShowHamburgerMenu(false);

    const handleJournalReview = () => {
        setShowHamburgerMenu(false);
        console.log('Navigate to JournalReview');
    };

    const handleNotifications = () => {
        setShowHamburgerMenu(false);
        console.log('Navigate to Notifications');
    };

    const handleSpiritualTraditions = () => {
        setShowHamburgerMenu(false);
        console.log('Navigate to SpiritualTraditions');
    };

    const handleHomeNavigation = () => {
        setShowHamburgerMenu(false);
        console.log('Navigate to Main');
    };

    const handleMenuNavigation = (screenName: string) => {
        closeHamburgerMenu();
        console.log('Navigate to:', screenName);
    };

    const handleEditIntention = () => {
        setTempIntention(data.intention);
        setEditingIntention(true);
        setIntentionSaveState(prev => ({ ...prev, saved: false, error: false }));
    };

    const handleSaveIntention = () => {
        setIntentionSaveState({ saving: true, saved: false, error: false, retryCount: 0 });
        setTimeout(() => {
            // Simulate occasional error for demo purposes
            const shouldError = Math.random() < 0.3; // 30% chance of error

            if (shouldError) {
                setIntentionSaveState({ saving: false, saved: false, error: true, retryCount: 1 });
            } else {
                setData(prev => ({ ...prev, intention: tempIntention }));
                setEditingIntention(false);
                setIntentionSaveState({ saving: false, saved: true, error: false, retryCount: 0, lastSaved: new Date() });
                setTimeout(() => {
                    setIntentionSaveState(prev => ({ ...prev, saved: false }));
                }, 3000);
            }
        }, 1000);
    };

    const handleCancelIntention = () => {
        setTempIntention(data.intention);
        setEditingIntention(false);
    };

    const handleEditReflection = () => {
        setTempReflection(data.reflection);
        setEditingReflection(true);
        setReflectionSaveState(prev => ({ ...prev, saved: false, error: false }));
    };

    const handleSaveReflection = () => {
        setReflectionSaveState({ saving: true, saved: false, error: false, retryCount: 0 });
        setTimeout(() => {
            setData(prev => ({ ...prev, reflection: tempReflection }));
            setEditingReflection(false);
            setReflectionSaveState({ saving: false, saved: true, error: false, retryCount: 0, lastSaved: new Date() });
            setTimeout(() => {
                setReflectionSaveState(prev => ({ ...prev, saved: false }));
            }, 3000);
        }, 1000);
    };

    const handleCancelReflection = () => {
        setTempReflection(data.reflection);
        setEditingReflection(false);
    };

    const handleManualRetryIntention = () => {
        handleSaveIntention();
    };

    const handleManualRetryReflection = () => {
        handleSaveReflection();
    };

    const toggleReflection = () => setExpandedReflection(prev => !prev);

    const getSaveButtonText = (saveState: SaveState, defaultText: string): string => {
        if (saveState.saving) return 'Saving...';
        if (saveState.saved) return 'Saved!';
        if (saveState.error) return 'Error';
        return defaultText;
    };

    const getSaveButtonStyle = (saveState: SaveState) => ({
        width: 80,
        backgroundColor: saveState.saving
            ? '#9CA3AF'
            : saveState.saved
                ? '#10B981'
                : saveState.error
                    ? '#EF4444'
                    : '#4F46E5',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    });

    const formatLastSaved = (lastSaved?: Date): string => {
        if (!lastSaved) return '';
        const now = new Date();
        const diffMs = now.getTime() - lastSaved.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes < 1) return 'just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return lastSaved.toLocaleDateString();
    };

    return (
        <>
            <PageLayout
                title="Golden Threads"
                showMenuButton={true}
                onMenuPress={openHamburgerMenu}
            >
                {/* PRIMARY: Intention Card */}
                <Card variant="glass" padding="lg" margin="md">
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: spacing.lg
                    }}>
                        <Text style={{ fontSize: 24, fontWeight: '500', color: '#111827' }}>
                            Today's Intention
                        </Text>
                        {!editingIntention && (
                            <Button
                                variant="secondary"
                                size="sm"
                                title="Edit"
                                onPress={handleEditIntention}
                            />
                        )}
                    </View>

                    {editingIntention ? (
                        <View>
                            <Input
                                variant="spiritual"
                                placeholder="What intention will illuminate your path today?"
                                multiline
                                numberOfLines={4}
                                value={tempIntention}
                                onChangeText={setTempIntention}
                                autoFocus
                            />
                            <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={handleSaveIntention}
                                    disabled={intentionSaveState.saving}
                                    style={getSaveButtonStyle(intentionSaveState)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        fontSize: fonts.xs,
                                        letterSpacing: 0.3,
                                    }}>
                                        {getSaveButtonText(intentionSaveState, 'Save')}
                                    </Text>
                                </TouchableOpacity>
                                {intentionSaveState.error && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        title="Retry"
                                        onPress={handleManualRetryIntention}
                                        disabled={intentionSaveState.saving}
                                    />
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Cancel"
                                    onPress={handleCancelIntention}
                                    disabled={intentionSaveState.saving}
                                />
                            </View>
                            {intentionSaveState.lastSaved && (
                                <View style={{ alignItems: 'center', marginTop: spacing.xs }}>
                                    <Text style={{
                                        fontSize: fonts.xs,
                                        color: '#9CA3AF',
                                        fontWeight: '400',
                                    }}>
                                        Last saved {formatLastSaved(intentionSaveState.lastSaved)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={{
                            backgroundColor: 'rgba(248, 250, 252, 0.9)',
                            padding: spacing.lg,
                            borderRadius: spacing.md,
                            marginBottom: spacing.lg
                        }}>
                            <Text style={{
                                fontSize: fonts.lg,
                                fontWeight: '500',
                                lineHeight: fonts.lg * 1.3,
                                color: '#4B5563'
                            }}>
                                {data.intention}
                            </Text>
                        </View>
                    )}
                </Card>

                {/* SECONDARY: Quote Card */}
                <Card variant="glass" padding="lg" margin="md">
                    <View style={{ marginBottom: spacing.lg }}>
                        <Text style={{ fontSize: 24, fontWeight: '500', color: '#111827' }}>
                            Wisdom
                        </Text>
                    </View>

                    <View style={{
                        backgroundColor: 'rgba(248, 250, 252, 0.9)',
                        padding: spacing.lg,
                        borderRadius: spacing.md,
                        marginBottom: spacing.lg
                    }}>
                        <Text style={{
                            fontSize: fonts.lg,
                            fontWeight: '500',
                            lineHeight: fonts.lg * 1.3,
                            color: '#4B5563',
                            fontStyle: 'italic'
                        }}>
                            "{data.quote}"
                            {data.author && (
                                <Text style={{
                                    fontSize: fonts.lg,
                                    fontWeight: '500',
                                    lineHeight: fonts.lg * 1.3,
                                    color: '#4B5563',
                                    fontStyle: 'normal'
                                }}>
                                    {' '}- {data.author}
                                </Text>
                            )}
                        </Text>
                    </View>
                </Card>

                {/* TERTIARY: Reflection Card */}
                <Card variant="glass" padding="lg" margin="md">
                    <TouchableOpacity
                        onPress={toggleReflection}
                        activeOpacity={0.8}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: expandedReflection ? spacing.lg : 0
                        }}>
                            <Text style={{ fontSize: 24, fontWeight: '500', color: '#111827' }}>
                                My Reflection
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                                {!editingReflection && expandedReflection && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        title="Edit"
                                        onPress={handleEditReflection}
                                    />
                                )}
                                <Text style={{
                                    fontSize: fonts.lg,
                                    fontWeight: '600',
                                    color: '#6B7280'
                                }}>
                                    {expandedReflection ? '↑' : '↓'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {expandedReflection && (
                        <View>
                            {editingReflection ? (
                                <View>
                                    <Input
                                        variant="spiritual"
                                        placeholder="Share your reflection..."
                                        multiline
                                        numberOfLines={6}
                                        value={tempReflection}
                                        onChangeText={setTempReflection}
                                        autoFocus
                                    />
                                    <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            onPress={handleSaveReflection}
                                            disabled={reflectionSaveState.saving}
                                            style={getSaveButtonStyle(reflectionSaveState)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                fontSize: fonts.xs,
                                                letterSpacing: 0.3,
                                            }}>
                                                {getSaveButtonText(reflectionSaveState, 'Save')}
                                            </Text>
                                        </TouchableOpacity>
                                        {reflectionSaveState.error && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                title="Retry"
                                                onPress={handleManualRetryReflection}
                                                disabled={reflectionSaveState.saving}
                                            />
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            title="Cancel"
                                            onPress={handleCancelReflection}
                                            disabled={reflectionSaveState.saving}
                                        />
                                    </View>
                                    {reflectionSaveState.lastSaved && (
                                        <View style={{ alignItems: 'center', marginTop: spacing.xs }}>
                                            <Text style={{
                                                fontSize: fonts.xs,
                                                color: '#9CA3AF',
                                                fontWeight: '400',
                                            }}>
                                                Last saved {formatLastSaved(reflectionSaveState.lastSaved)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <View style={{
                                    backgroundColor: 'rgba(248, 250, 252, 0.9)',
                                    padding: spacing.lg,
                                    borderRadius: spacing.md,
                                    marginTop: spacing.lg
                                }}>
                                    <Text style={{
                                        fontSize: fonts.lg,
                                        fontWeight: '500',
                                        lineHeight: fonts.lg * 1.3,
                                        color: '#4B5563'
                                    }}>
                                        {data.reflection}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </Card>

                {/* Bottom Spacing */}
                <View style={{ height: spacing['3xl'] }} />
            </PageLayout>

            {/* Hamburger Menu Modal */}
            <MenuModal
                visible={showHamburgerMenu}
                onClose={closeHamburgerMenu}
                onNavigate={handleMenuNavigation}
                currentScreen="reflection-complete"
            />
        </>
    );
};
