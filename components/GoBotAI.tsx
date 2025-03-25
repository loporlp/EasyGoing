import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
//import { travel_agent_recommendation } from '../scripts/travelAgentAI.py';

// Default export (no need to use closing tags when importing)
const GoBotAI = () => {
    const [text, setText] = useState<string>('');
    const [recommendation, setRecommendation] = useState<string | null>(null);

    // Button press for GoBot AI
    const handlePress = () => {
        if (!(text.trim() === '')) {
            // Call the method to ask GoBotAI a question
        sendTextToGoBot(text);
        }
    };

    // Gets a response from GoBotAI
    const sendTextToGoBot = (input: string) => {
        //const result = travel_agent_recommendation(input);
        const result = "Hi! I'm working but I'm a static GoBot!"; // TEMP
        setRecommendation(result);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Ask GoBot a question!"
            />
            <Button title="Send" onPress={handlePress} />

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