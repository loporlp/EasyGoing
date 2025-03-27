import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
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

            // Extracting the message text from the response
            const message = result?.choices?.[0]?.message;
            
            // Check if the message object exists and if it contains text
            const textResponse = message ? JSON.stringify(message) : 'No valid response available';

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

            {/* Response if recommendation exists */}
            {recommendation && (
                <ScrollView style={styles.responseContainer}>
                    <Text style={styles.responseText}>{recommendation}</Text>
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
    responseText: {
        fontSize: 16,
        color: 'black',
        flexShrink: 1,
    },
});

export default GoBotAI;
