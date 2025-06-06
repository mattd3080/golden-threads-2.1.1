import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PageLayout } from '../components/layout';
import { Card, Button, Input } from '../components';
import { COLORS, FONTS, SPACING } from '../constants';

interface DetailSection {
    id: string;
    title: string;
    content: string;
    editable?: boolean;
    multiline?: boolean;
    placeholder?: string;
}

interface DetailAction {
    id: string;
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
    loading?: boolean;
}

interface DetailScreenTemplateProps {
    title: string;
    sections: DetailSection[];
    actions?: DetailAction[];
    onSectionChange?: (sectionId: string, value: string) => void;
    onMenuPress?: () => void;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    loading?: boolean;
}

export const DetailScreenTemplate: React.FC<DetailScreenTemplateProps> = ({
    title,
    sections,
    actions = [],
    onSectionChange,
    onMenuPress,
    headerContent,
    footerContent,
    loading = false,
}) => {
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<Record<string, string>>({});

    const handleEditStart = (sectionId: string, currentValue: string) => {
        setEditingSection(sectionId);
        setTempValues(prev => ({ ...prev, [sectionId]: currentValue }));
    };

    const handleEditSave = (sectionId: string) => {
        const newValue = tempValues[sectionId];
        if (newValue !== undefined && onSectionChange) {
            onSectionChange(sectionId, newValue);
        }
        setEditingSection(null);
    };

    const handleEditCancel = () => {
        setEditingSection(null);
        setTempValues({});
    };

    const renderSection = (section: DetailSection) => {
        const isEditing = editingSection === section.id;
        const displayValue = isEditing ? tempValues[section.id] : section.content;

        return (
            <Card key={section.id} variant="glass" margin="sm">
                {/* Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.editable && !isEditing && (
                        <TouchableOpacity
                            onPress={() => handleEditStart(section.id, section.content)}
                            style={styles.editButton}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Section Content */}
                {isEditing ? (
                    <View style={styles.editingContainer}>
                        <Input
                            value={displayValue || ''}
                            onChangeText={(value) =>
                                setTempValues(prev => ({ ...prev, [section.id]: value }))
                            }
                            placeholder={section.placeholder}
                            multiline={section.multiline}
                            numberOfLines={section.multiline ? 4 : 1}
                            variant="spiritual"
                            autoFocus={true}
                        />
                        <View style={styles.editActions}>
                            <Button
                                title="Cancel"
                                onPress={handleEditCancel}
                                variant="ghost"
                                size="sm"
                            />
                            <Button
                                title="Save"
                                onPress={() => handleEditSave(section.id)}
                                variant="primary"
                                size="sm"
                            />
                        </View>
                    </View>
                ) : (
                    <Text style={styles.sectionContent}>
                        {section.content || (section.placeholder && (
                            <Text style={styles.placeholderText}>{section.placeholder}</Text>
                        ))}
                    </Text>
                )}
            </Card>
        );
    };

    return (
        <PageLayout
            title={title}
            showMenuButton={true}
            onMenuPress={onMenuPress}
        >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Content */}
                {headerContent && (
                    <View style={styles.headerContent}>
                        {headerContent}
                    </View>
                )}

                {/* Sections */}
                {sections.map(renderSection)}

                {/* Actions */}
                {actions.length > 0 && (
                    <View style={styles.actionsContainer}>
                        {actions.map((action) => (
                            <Button
                                key={action.id}
                                title={action.title}
                                onPress={action.onPress}
                                variant={action.variant || 'primary'}
                                fullWidth={actions.length === 1}
                                style={actions.length > 1 ? styles.actionButton : undefined}
                            />
                        ))}
                    </View>
                )}

                {/* Footer Content */}
                {footerContent && (
                    <View style={styles.footerContent}>
                        {footerContent}
                    </View>
                )}
            </ScrollView>
        </PageLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerContent: {
        marginBottom: SPACING.md,
    },

    footerContent: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },

    sectionTitle: {
        fontSize: FONTS.size.lg,
        fontWeight: FONTS.weight.semibold,
        color: COLORS.text.primary,
        flex: 1,
    },

    editButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.glass,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },

    editButtonText: {
        fontSize: FONTS.size.sm,
        color: COLORS.primary,
        fontWeight: FONTS.weight.medium,
    },

    sectionContent: {
        fontSize: FONTS.size.base,
        color: COLORS.text.primary,
        lineHeight: 24,
    },

    placeholderText: {
        color: COLORS.text.tertiary,
        fontStyle: 'italic',
    },

    editingContainer: {
        gap: SPACING.md,
    },

    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SPACING.sm,
    },

    actionsContainer: {
        marginTop: SPACING.lg,
        gap: SPACING.md,
    },

    actionButton: {
        marginBottom: SPACING.sm,
    },
}); 