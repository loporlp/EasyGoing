import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ViewStyle, TextStyle} from 'react-native';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {getIdToken} from '../scripts/getFirebaseID'


type AutocompleteTextBoxProps = {
    style?: ViewStyle; // TODO: Need a default style
    onPlaceSelect?: (address: { description: string; place_id: string }) => string; // Callback when a place is selected
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string; // Accept a value prop to set the initial value
  };

  

const AutocompleteTextBox = ({ style, onPlaceSelect, placeholder, placeholderTextColor, value = ''} : AutocompleteTextBoxProps) => {
    const [text, setText] = useState(value);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isSelectingAddress, setIsSelectingAddress] = useState(false); // Track if an address is selected
    const [previousText, setPreviousText] = useState(''); // Track previous text
    const [initialLoad, setInitialLoad] = useState(true); // Tracks if it's first render
    

    useEffect(() => {
        if (value !== text) {
            setText(value);
            setInitialLoad(true);
            setAddresses([]);
        }
    }, [value]);
    
    
    const handlePlaceSelect = (selectedPlace : string) => {
        console.log("Place selected:", selectedPlace);
        // Ensure the callback is invoked with the correct data
        if (onPlaceSelect) {
            onPlaceSelect({ description: selectedPlace, place_id: "test" });
        }
      };

    useEffect(() => {
        // Fetch addresses only if text is provided and not selecting an address AND did not just select an address
        if (!initialLoad && text && !isSelectingAddress && text !== previousText) {
            callProtectedApi(text);
            setPreviousText(text);
        } else {
            setAddresses([]); // Clear addresses if no text or selecting address
        }
    }, [text, isSelectingAddress, previousText]);

    {/* Get Addresses */}
    const callProtectedApi = async (text : string) => {
      try {
        // Retrieve the ID token
        const idToken = await getIdToken(auth);

        // Define the API endpoint
        const apiUrl = `https://ezgoing.app/api/autocomplete?input=${text}`; // Search term is the user inputted that we are auto completeing

        // Make the API call
        const response = await fetch(apiUrl, {
          method: "GET", // Or "POST", "PUT", etc.
          headers: {
            Authorization: `Bearer ${idToken}`, // Include the ID token in the header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Below is added from above in getAddresses
        if (data.predictions && data.predictions.length > 0) {
            setAddresses(data.predictions.slice(0, 5)); // Limit to 5 results
        } else {
            setAddresses([]); // Clear if no results
        }
        console.log("API Response:", data); // Handle the response
      } catch (error) {
        console.error("Error calling API:", error);
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
                onFocus={() => {
                    setText("");
                    setPreviousText(text);
                    //setIsSelectingAddress(false);
                }}
                onBlur={() => {
                    if (!isSelectingAddress) {
                      // The user did NOT pick a suggestion => revert to original text
                      setText(previousText);
                    }
                  }}
                onChangeText={(newText) => {
                    setText(newText);
                    setIsSelectingAddress(false);
                    setAddresses([]); // Clear suggestions as user types
                    setInitialLoad(false);
                }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={styles.input}
            />

            {/* Render the list of suggestions */}
            {addresses.length > 0 && (
                <View style={styles.dropdownContainer}>
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectAddress(item)}
                      style={styles.suggestionItem}
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
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
        borderBottomWidth: 0,
        fontSize: 18,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 5,
        paddingLeft: 5,
        textAlign: 'left',
        writingDirection: 'ltr',
        alignItems: "center"
    },

    suggestionList: {
        position: 'absolute',
        top: 40, // Positioning the list directly below the TextInput
        left: 0,
        right: 0,
        zIndex: 100, // Ensure the suggestions list appears above the TextInput
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
    dropdownContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderTopWidth: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 9999,
        elevation: 20, 
      },
});

export default AutocompleteTextBox;
