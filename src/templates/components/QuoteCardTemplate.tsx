import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

interface ExpandableSectionProps {
    title: string;
    content: string;
    isExpanded: boolean;
    onToggle: () => void;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content, isExpanded, onToggle }) => (
    <View style={styles.expandableContainer}>
        <TouchableOpacity
            onPress={onToggle}
            style={styles.expandableHeader}
            activeOpacity={0.8}
        >
            <Text style={styles.expandableTitle}>{title}</Text>
            <Text style={[
                styles.chevronText,
                { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }
            ]}>
                ▼
            </Text>
        </TouchableOpacity>

        {isExpanded && (
            <View style={styles.expandableContent}>
                <Text style={styles.expandableText}>{content}</Text>
            </View>
        )}
    </View>
);

interface QuoteCardTemplateProps {
    quote: string;
    author: string;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    expandableContent?: {
        goDeeper: string;
        goldenThread: string;
        aboutSource: string;
    };
}

export const QuoteCardTemplate: React.FC<QuoteCardTemplateProps> = ({
    quote,
    author,
    onRefresh,
    isRefreshing = false,
    expandableContent = {
        goDeeper: "This teaching invites us to recognize that while we cannot change the past or control the future, we have complete agency over our present awareness and response.",
        goldenThread: "This wisdom connects us to the universal threads of truth that weave through all spiritual traditions, reminding us of our shared human experience.",
        aboutSource: "A spiritual teacher and wisdom keeper whose teachings continue to inspire seekers around the world."
    }
}) => {
    const [isConceptExpanded, setIsConceptExpanded] = useState(false);
    const [isGoldenThreadExpanded, setIsGoldenThreadExpanded] = useState(false);
    const [isSourceExpanded, setIsSourceExpanded] = useState(false);

    const handleRefresh = () => {
        if (onRefresh) onRefresh();
    };

    return (
        <View style={styles.container}>
            {/* Header with refresh button */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Today's Wisdom</Text>
                </View>

                <TouchableOpacity
                    onPress={handleRefresh}
                    disabled={isRefreshing}
                    style={styles.refreshButton}
                    activeOpacity={0.7}
                >
                    {isRefreshing ? (
                        <ActivityIndicator size="small" color="#4F46E5" />
                    ) : (
                        <Text style={styles.refreshText}>↻</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Quote text */}
            <Text style={styles.quoteText}>
                <Text style={styles.quoteMark}>"</Text>
                {quote}
                <Text style={styles.quoteMark}>"</Text>
            </Text>

            {/* Source */}
            <View style={styles.sourceContainer}>
                <Text style={styles.sourceText}>{author}</Text>
            </View>

            {/* Expandable sections */}
            <View style={styles.expandableSections}>
                <ExpandableSection
                    title="Go Deeper"
                    content={expandableContent.goDeeper}
                    isExpanded={isConceptExpanded}
                    onToggle={() => setIsConceptExpanded(!isConceptExpanded)}
                />

                <ExpandableSection
                    title="Golden Thread"
                    content={expandableContent.goldenThread}
                    isExpanded={isGoldenThreadExpanded}
                    onToggle={() => setIsGoldenThreadExpanded(!isGoldenThreadExpanded)}
                />

                <ExpandableSection
                    title="About the Source"
                    content={expandableContent.aboutSource}
                    isExpanded={isSourceExpanded}
                    onToggle={() => setIsSourceExpanded(!isSourceExpanded)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 24,
        padding: 32,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        minHeight: 200,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: '#111827',
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
    },
    refreshText: {
        fontSize: 20,
        color: '#4F46E5',
    },
    quoteText: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: '300',
        color: '#4B5563',
        marginBottom: 20,
        textAlign: 'left',
    },
    quoteMark: {
        fontSize: 36,
        color: '#4F46E5',
        opacity: 0.5,
    },
    sourceContainer: {
        marginBottom: 24,
    },
    sourceText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#4B5563',
    },
    expandableSections: {
        gap: 8,
    },
    expandableContainer: {
        marginBottom: 8,
    },
    expandableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F8F7FF',
        borderWidth: 1,
        borderColor: '#F8F7FF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    expandableTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#4F46E5',
        flex: 1,
    },
    chevronText: {
        color: '#4F46E5',
    },
    expandableContent: {
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#F8F7FF40',
        borderLeftWidth: 4,
        borderLeftColor: '#C7D2FE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    expandableText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4B5563',
    },
}); 