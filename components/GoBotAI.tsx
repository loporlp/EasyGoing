import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, Animated, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { travelAgentApi } from '../scripts/travelAgentApi';
import { storeData, getData } from '../scripts/localStore.js';

const GoBotAI = () => {
    const [text, setText] = useState<string>('');
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [textLoading, setTextLoading] = useState<boolean>(false);
    const fadeAnimation = useState(new Animated.Value(0))[0];
    const pulseAnimation = useState(new Animated.Value(1))[0];

    const [trip, setTrip] = useState<any>(null);
    const [tripId, setTripId] = useState<string | null>(null);

    // Load existing trip data
    useEffect(() => {
        const loadTrip = async () => {
            try {
                const currentTripID = await getData("currentTrip"); // Fetch the current trip ID from storage
                if (currentTripID) {
                    const tripDetails = await getData(currentTripID.toString());
                    // Check if the trip details include 'id' correctly
                    if (tripDetails) {
                        setTripId(currentTripID);  // Store only the trip id
                        setTrip(tripDetails);  // Store the full trip data
                        console.log("Trip ID Set:", currentTripID);
                    } else {
                        console.error("Trip data is invalid, missing trip details");
                    }
                }
            } catch (error) {
                console.error("Error loading trip data:", error);
            }
        };

        loadTrip();
    }, []);

    useEffect(() => {
        // Start pulsing animation when text is loading
        if (textLoading) {
            Animated.loop(
                Animated.sequence([
                    // Size up
                    Animated.timing(pulseAnimation, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    // Size down
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            // Stop pulsing animation when text is finished
            Animated.timing(pulseAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).stop();
        }
    }, [textLoading, pulseAnimation]);
   

    useEffect(() => {
        if (recommendation) {
            let index = 0;
            setDisplayedText(recommendation[index]);
            setTextLoading(true);
    
            const updateText = () => {
                if (index < recommendation.length - 1) {
                    setDisplayedText(prev => prev + recommendation[index]);
                    index++;
                    requestAnimationFrame(updateText);
                } else {
                    setTextLoading(false);
                }
            };
    
            // Start appending characters one by one
            requestAnimationFrame(updateText);
        }
    }, [recommendation]);
    

    // Button press for GoBot AI
    const handlePress = () => {
        if (!(text.trim() === '')) {
            sendTextToGoBot(text);
        }
    };

    // Limited Chat History
    function storeToHistory(input: string, textResponse: any) {
        // TODO: Store the chat history and allow the user to access it through a button?
    }

    // Gets a response from GoBotAI
    const sendTextToGoBot = async (input: string) => {
        setLoading(true);
        try {
            const result = await travelAgentApi(input);
            
            // Extract GoBot's response text :D
            const textResponse = result?.choices?.[0]?.message?.content || 'Sorry! Please try again!';

            // Send to history
            storeToHistory(input, textResponse);

            setRecommendation(textResponse);
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Error fetching data:', error);
            setRecommendation('Sorry, something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Mascot Image */}
            <View style={styles.mascotWrapper}>
            <Animated.Image
                source={require('../assets//images/GoBotAI.png')} 
                style={[styles.mascotImage, { transform: [{ scale: pulseAnimation }] }]}
            />
            </View>

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
                        title={loading || textLoading ? "Sending..." : "Send"}
                        onPress={handlePress}
                        disabled={loading || textLoading}
                    />
                </View>
            </View>

            {/* Render Recommendation with Fade-in Animation */}
            {recommendation && (
                <Animated.View style={[styles.recommendDest, { opacity: fadeAnimation }]}>                    
                    <ScrollView>
                        <Markdown>{displayedText}</Markdown>
                    </ScrollView>
                </Animated.View>
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
    mascotWrapper: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mascotImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
});

export default GoBotAI;

