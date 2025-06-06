import React, { useState } from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PageLayout } from '../../src/components/layout';
import { Card } from '../components';
import { COLORS, FONTS, SPACING } from '../../src/constants';

interface ListItem {
    id: string;
    [key: string]: any;
}

interface ListScreenTemplateProps<T extends ListItem> {
    title: string;
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    onItemPress?: (item: T) => void;
    onRefresh?: () => Promise<void>;
    onMenuPress?: () => void;
    loading?: boolean;
    emptyState?: {
        title: string;
        description: string;
        action?: {
            title: string;
            onPress: () => void;
        };
    };
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

export function ListScreenTemplate<T extends ListItem>({
    title,
    data,
    renderItem,
    onItemPress,
    onRefresh,
    onMenuPress,
    loading = false,
    emptyState,
    headerContent,
    footerContent,
}: ListScreenTemplateProps<T>) {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (onRefresh) {
            setRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setRefreshing(false);
            }
        }
    };

    const renderEmptyState = () => {
        if (!emptyState) return null;

        return (
            <View style={styles.emptyStateContainer}>
                <Card variant="glass" padding="xl">
                    <Text style={styles.emptyStateTitle}>{emptyState.title}</Text>
                    <Text style={styles.emptyStateDescription}>{emptyState.description}</Text>
                    {emptyState.action && (
                        <TouchableOpacity
                            style={styles.emptyStateButton}
                            onPress={emptyState.action.onPress}
                        >
                            <Text style={styles.emptyStateButtonText}>{emptyState.action.title}</Text>
                        </TouchableOpacity>
                    )}
                </Card>
            </View>
        );
    };

    const renderListItem = ({ item }: { item: T }) => (
        <Card
            variant="glass"
            margin="xs"
            style={onItemPress ? styles.pressableCard : undefined}
        >
            {onItemPress ? (
                <TouchableOpacity onPress={() => onItemPress(item)}>
                    {renderItem(item)}
                </TouchableOpacity>
            ) : (
                renderItem(item)
            )}
        </Card>
    );

    return (
        <PageLayout
            title={title}
            showMenuButton={true}
            onMenuPress={onMenuPress}
        >
            {/* Header Content */}
            {headerContent && (
                <View style={styles.headerContent}>
                    {headerContent}
                </View>
            )}

            {/* Main List */}
            <FlatList
                data={data}
                renderItem={renderListItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    ) : undefined
                }
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={footerContent ? (
                    <View style={styles.footerContent}>
                        {footerContent}
                    </View>
                ) : undefined}
                contentContainerStyle={[
                    styles.listContainer,
                    data.length === 0 && styles.emptyListContainer,
                ]}
                // Performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={8}
                getItemLayout={undefined} // Let FlatList calculate automatically
            />
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    headerContent: {
        marginBottom: SPACING.md,
    },

    footerContent: {
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },

    listContainer: {
        paddingVertical: SPACING.sm,
    },

    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    pressableCard: {
        // Add visual feedback for pressable items
        transform: [{ scale: 1 }],
    },

    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },

    emptyStateTitle: {
        fontSize: FONTS.size.xl,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },

    emptyStateDescription: {
        fontSize: FONTS.size.base,
        color: COLORS.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: SPACING.lg,
    },

    emptyStateButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 25,
        alignSelf: 'center',
    },

    emptyStateButtonText: {
        color: COLORS.text.white,
        fontSize: FONTS.size.base,
        fontWeight: FONTS.weight.medium,
    },
}); 