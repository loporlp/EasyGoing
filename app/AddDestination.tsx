// AddDestination.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from "expo-router";

const AddDestination = () => {

  // Sets up navigations
  const router = useRouter();

  /**
   * Will navigate to the "HomeScreen" screen after link is pressed (change this later).
   */
  const cancelAdd = () => {
    router.push("/HomeScreen")
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require("../assets/images/tokyo.jpg")} style={styles.backgroundImage} />

      <View style={styles.inputContainer}>
        {/* Text Input For Location, Duration, Priority, and Notes */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Location:</Text>
          <TextInput style={styles.textBox} placeholder="Tokyo Sky Tree" placeholderTextColor="black"  />
          <Text style={styles.text}>Duration:</Text>
          <TextInput style={styles.textBox} placeholder="30 Minutes" placeholderTextColor="black" keyboardType="numeric"/>
          <Text style={styles.text}>Priority:</Text>
          <TextInput style={styles.textBox} placeholder="2" placeholderTextColor="black" keyboardType="numeric"/>
          <Text style={styles.text}>Notes:</Text>
          <TextInput style={styles.textBox} placeholder="Notes" placeholderTextColor="black"/>
        </View>
        {/* Add + Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Cancel" onPress={cancelAdd} />
          </View>
          <View style={styles.button}>
            <Button title="Add" onPress={() => {}} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    paddingTop: 60, // For status bar space
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: "50%",
    marginBottom: 20,
  },
  text: {
    color: "black",
    backgroundColor: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  textBox: {
    flex: 1,
    height: 80,
    borderColor: '#999',
    borderBottomWidth: 1,
    marginRight: 10,
    fontSize: 32,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    height: 50,
  }
});

export default AddDestination;