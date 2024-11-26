import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ViewStyle, TextStyle} from 'react-native';
import axios from 'axios';

const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';

type AutocompleteTextBoxProps = {
    style?: ViewStyle | TextStyle; // TODO: Need a default style
    onPlaceSelect?: (address: { description: string; place_id: string }) => string; // Callback when a place is selected
    placeholder: string;
    placeholderTextColor: string;
  };

const AutocompleteTextBox = ({ style, onPlaceSelect, placeholder, placeholderTextColor} : AutocompleteTextBoxProps) => {
    const [text, setText] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [isSelectingAddress, setIsSelectingAddress] = useState(false); // Track if an address is selected
    const [previousText, setPreviousText] = useState(''); // Track previous text

    const handlePlaceSelection = (selectedPlace) => {
        console.log("Place selected:", selectedPlace);
        // Ensure the callback is invoked with the correct data
        onPlaceSelect(selectedPlace);
      };

    useEffect(() => {
        // Fetch addresses only if text is provided and not selecting an address AND did not just select an address
        if (text && !isSelectingAddress && text !== previousText) {
            getAddresses(text);
            setPreviousText(text);
        } else {
            setAddresses([]); // Clear addresses if no text or selecting address
        }
    }, [text, isSelectingAddress, previousText]);

    const getAddresses = async (text : string) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}`;
            const response = await axios.get(url);

            if (response.data.predictions && response.data.predictions.length > 0) {
                setAddresses(response.data.predictions.slice(0, 5)); // Limit to 5 results
            } else {
                setAddresses([]); // Clear if no results
            }
        } catch (error) {
            console.error('Error fetching autocomplete addresses:', error);
            Alert.alert('Error', 'Failed to fetch addresses');
        }
    };

    type Address = {
        place_id: string; // TODO: maybe int (has to be set here)
        description: string;
      };

    const handleSelectAddress = (address : Address) => {
        setAddresses([]); // Clear suggestions
        setText(address.description); // Set the selected address in the TextInput
        setIsSelectingAddress(true);
        setPreviousText(address.description);

        // Trigger the callback with the selected address's details
        if (onPlaceSelect) {
            console.log('Place selected:', address);
            onPlaceSelect({
                description: address.description,
                place_id: address.place_id,
            });
        }

        setTimeout(() => {
            setIsSelectingAddress(false); // Re-enable address fetching after a short delay
        }, 1000);
    };

    return (
        <View style={[styles.container, style]}>
            {/* Search textbox */}
            <TextInput
                value={text}
                onChangeText={(newText) => {
                    setText(newText);
                    setIsSelectingAddress(false);
                    setAddresses([]); // Clear suggestions as user types
                }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={styles.input}
            />

            {/* Render the list of suggestions */}
            {addresses.length > 0 && (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSelectAddress(item)} // Handle address selection
                            style={styles.suggestionItem}
                        >
                            <Text>{item.description}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionList}
                />
            )}
        </View>
    );
};

// Default styles for the component
const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    input: {
        height: 40,
        borderColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 5,
        paddingLeft: 20,
    },

    suggestionList: {
        position: 'absolute',
        top: 40, // Positioning the list directly below the TextInput
        left: 0,
        right: 0,
        zIndex: 1, // Ensure the suggestions list appears above the TextInput
        backgroundColor: 'white', // Make sure the list has a background color to separate from the underlying UI
        borderColor: '#ddd',
        borderTopWidth: 1, // Optional, to separate suggestions from the input box visually
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
});

export default AutocompleteTextBox;
