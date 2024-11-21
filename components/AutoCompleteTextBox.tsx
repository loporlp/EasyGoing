import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const apiKey = 'AIzaSyANe_6bk7NDht5ECPAtRQ1VZARSHBMlUTI';

const AutocompleteTextBox = () => {
    const [text, setText] = useState('');
    const [addresses, setAddresses] = useState([])
    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {
        // If there's text, get addresses, otherwise, there's nothing
        if (text) {
            getAddresses(text);
        } else {
            getAddresses([]);
        }
        }, [text]);

    const getAddresses = async (text) => {
        try {
            // The API Call
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}`

            // Make the request
            const response = await axios.get(url);

            // Are there address results?
            if (response.data.predictions && response.data.predictions.length > 0) {
                // Limit results to 3-5 items
                        setAddresses(response.data.predictions.slice(0, 5));
            } else {
                // No addresses shown
                setAddresses([]);
            }
        } catch (error) {
            // TODO: Need something to handle errors
            console.error(error);
            Alert.alert('Error', 'Failed to fetch addresses');
        }
    };

const handleSelectAddress = (address) => {
    // Clear the suggestions once an address is selected
    setAddresses([]);
    // Update the TextInput with the selected address
    setText(address.description);
  };

return (
    <View>
        {/* Search textbox */}
        <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Search"
            style={{
                // TODO: Frontend modifications here
                borderBottomWidth: 1,
                borderColor: 'gray',
                marginBottom: 10,
                paddingLeft: 10,
                height: 40,
            }}
        />

        {/* Render the list of suggestions */}
        {addresses.length > 0 && (
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectAddress(item)} // Handle address selection
                        style={{
                            // TODO: Frontend modifications here
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: 'gray',
                        }}
                    >
                        <Text>{item.description}</Text>
                    </TouchableOpacity>
                 )}
            />
        )}
    </View>
    );
};

export default AutocompleteTextBox;
