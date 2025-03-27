import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { travelAgentApi } from '../scripts/travelAgentApi';

const GoBotAI = () => {
    const [text, setText] = useState<string>('');
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Button press for GoBot AI
    const handlePress = () => {
        if (!(text.trim() === '')) {
            sendTextToGoBot(text);
        }
    };

    // Gets a response from GoBotAI
    const sendTextToGoBot = async (input: string) => {
        setLoading(true);
        try {
            const result = await travelAgentApi(input);

            // Extract GoBot's response text :D
            const textResponse = result?.choices?.[0]?.message?.content || 'Sorry! Please try again!';

            setRecommendation(textResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
            setRecommendation('Sorry, something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Ask GoBot a question!"
            />
            <Button
                title={loading ? "Sending..." : "Send"}
                onPress={handlePress}
                disabled={loading}
            />

            {/* Render Recommendation */}
            {recommendation && (
                <ScrollView style={styles.responseContainer}>
                    <Markdown>{recommendation}</Markdown>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#999',
        borderBottomWidth: 0.5,
        fontSize: 18,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 5,
        paddingLeft: 5,
        textAlign: 'left',
        writingDirection: 'ltr',
        marginBottom: 20,
    },
    responseContainer: {
        marginTop: 20,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 200,
    },
});

export default GoBotAI;
