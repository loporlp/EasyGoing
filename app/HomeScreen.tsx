// HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from "expo-router";

const HomeScreen = () => {

  // Sets up navigations
  const router = useRouter();

  /**
   * Will navigate to the "Account" screen after link is pressed.
   */
  const navigateToAccount = () => {
    router.push("/Account")
  }

  return (
    <View style={styles.container}>
      {/* Account Button in the Top Right */}
      <TouchableOpacity style={styles.accountButton} onPress={navigateToAccount}>
        <Text style={styles.accountButtonText}>Account</Text>
      </TouchableOpacity>


      {/* Two Buttons in the Middle */}
      <View style={styles.buttonContainer}>
        <Button title="New Trip" onPress={() => {}} />
        <View style={{ height: 20 }} />
        <Button title="Edit Existing Trip" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // For status bar space
    backgroundColor: '#fff',
  },
  accountButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  accountButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;