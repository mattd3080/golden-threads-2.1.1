import React from 'react';
import { View, Text } from 'react-native';
import { PageLayout } from '../components/layout';
import { Card, Button, Input, PromptCard, QuoteCardTemplate } from '../components';

// Simplified preview component - just the visual design
export function MainPagePreview() {
    return (
        <PageLayout
            title="Golden Threads"
            showMenuButton={true}
            onMenuPress={() => console.log('Menu pressed')}
        >
            {/* Quote Card with exact original styling */}
            <QuoteCardTemplate
                quote="The present moment is the only time over which we have dominion."
                author="— Thích Nhất Hạnh"
                onRefresh={() => console.log('Refresh pressed')}
                expandableContent={{
                    goDeeper: "This teaching invites us to recognize that while we cannot change the past or control the future, we have complete agency over our present awareness and response. True power lies not in trying to dominate external circumstances, but in mastering our inner state and choosing how we meet each moment.",
                    goldenThread: "This wisdom connects us to the universal threads of truth that weave through all spiritual traditions, reminding us of our shared human experience and the timeless nature of divine wisdom.",
                    aboutSource: "Thích Nhất Hạnh (1926-2022) was a Vietnamese Zen Buddhist monk, peace activist, and prolific author who brought mindfulness practice to the West. Known for his gentle teaching style and profound wisdom, he founded Plum Village monastery in France and taught the art of mindful living to millions worldwide."
                }}
            />

            {/* Reflection Card - Using exact original styling */}
            <Card variant="glass" padding="lg">
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: '500', color: '#111827' }}>
                        Reflection
                    </Text>
                </View>

                {/* Daily Prompt using PromptCard component */}
                <PromptCard text="What moment today filled you with gratitude?" />

                {/* Journal Input */}
                <Input
                    value=""
                    onChangeText={() => { }}
                    placeholder="Let your thoughts flow like water, naturally and without judgment."
                    variant="spiritual"
                    multiline={true}
                    numberOfLines={6}
                    style={{ marginBottom: 0 }}
                />
            </Card>

            {/* Sacred Intention Card */}
            <Card variant="glass" padding="lg">
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, fontWeight: '500', color: '#111827' }}>
                        Set Your Intention
                    </Text>
                </View>

                <Input
                    value=""
                    onChangeText={() => { }}
                    placeholder="What intention will illuminate your path today?"
                    variant="spiritual"
                    multiline={true}
                    numberOfLines={2}
                    style={{ marginBottom: 0 }}
                />
            </Card>

            {/* Remember Button */}
            <View style={{ alignItems: 'center', marginVertical: 32 }}>
                <Button
                    title="Remember"
                    onPress={() => console.log('Remember pressed')}
                    variant="primary"
                    size="lg"
                    style={{ minWidth: 200 }}
                />
            </View>
        </PageLayout>
    );
} 