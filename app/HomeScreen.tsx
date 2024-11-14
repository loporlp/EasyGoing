// HomeScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const HomeScreen = () => {
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Sign out error:', error);
    });
  };

  return (
    <View style={styles.container}>
      {/* Account Button in the Top Right */}
      <TouchableOpacity style={styles.accountButton} onPress={handleSignOut}>
        <Text style={styles.accountButtonText}>Account</Text>
      </TouchableOpacity>

      {/* Two Buttons in the Middle */}
      <View style={styles.buttonContainer}>
        <Button title="Button 1" onPress={fetchData} />
        <View style={{ height: 20 }} />
        <Button title="Button 2" onPress={() => {}} />
      </View>
    </View>
  );
};

const fetchData = async () => {
  try {
    const response = await fetch('http://3.129.16.62:3000/api/data');
    const data = await response.json();
    console.log(data.message); // This should log "Hello from the server!"
  } catch (error) {
    console.error('Error fetching data:', error);
  }
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
