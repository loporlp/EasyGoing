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
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchBar}
                    value={text}
                    onChangeText={setText}
                    placeholder="Ask GoBot a question!"
                    multiline
                />
                <View style={styles.buttonWrapper}>
                    <Button
                        title={loading ? "Sending..." : "Send"}
                        onPress={handlePress}
                        disabled={loading}
                    />
                </View>
            </View>

            {/* Render Recommendation */}
            {recommendation && (
                <ScrollView style={styles.recommendDest}>
                    <Markdown>{recommendation}</Markdown>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "70%",
        backgroundColor: "#F4F4F4",
        borderRadius: 10,
        padding: 20,
    },
    searchSection: {
        flexDirection: "row",
        marginVertical: 20,
        marginTop: 15,
        paddingHorizontal: 20,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        height: 50,
    },
    searchBar: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        height: 50,
    },
    buttonWrapper: {
        height: 50,
        justifyContent: "center",
        marginLeft: 10,
    },
    recommendDest: {
        backgroundColor: "white",
        padding: 10,
        height: 250,
        borderRadius: 10,
        width: "100%",
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: "hidden",
    },
});

export default GoBotAI;
