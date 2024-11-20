// AddDestination.tsx
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Modal, ImageBackground } from 'react-native';
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

  // Modal (Pop-up)
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <View style={styles.container}>
      {/* Popup Button */}
      <View style={styles.showContainer}>
        <ImageBackground source={require("../assets/images/green.png")} style={styles.backgroundImage}>
          <View style={styles.button}>
            <Button title="Show" onPress={show} />
          </View>
        </ImageBackground>
      </View>

      <Modal animationType="fade" visible={visible} transparent={true} onRequestClose={hide}>
        <View style={styles.popup}>
          <ImageBackground source={require("../assets/images/blue.png")} style={styles.backgroundImage}>
            <View style={styles.inputContainer}>
              {/* Text Input For Location, Duration, Priority, and Notes */}
              <View style={styles.textContainer}>
                <Text style={styles.text}>Location:</Text>
                <TextInput style={styles.textBox} placeholder="Tokyo Sky Tree" placeholderTextColor="gray"  />
                <Text style={styles.text}>Duration (Minutes):</Text>
                <TextInput style={styles.textBox} placeholder="30 Minutes" placeholderTextColor="gray" keyboardType="numeric"/>
                <Text style={styles.text}>Priority:</Text>
                <TextInput style={styles.textBox} placeholder="2" placeholderTextColor="gray" keyboardType="numeric"/>
                <Text style={styles.text}>Notes:</Text>
                <TextInput style={styles.textBox} placeholder="Notes" placeholderTextColor="gray"/>
              </View>
              {/* Add + Cancel Buttons */}
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button title="Cancel" onPress={hide} />
                </View>
                <View style={styles.button}>
                  <Button title="Add" onPress={cancelAdd} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    borderColor: "red",
    borderWidth: 1,
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
    color: "black",
    height: 20,
    borderColor: '#999',
    borderBottomWidth: 1,
    fontSize: 16,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    height: 50,
  },
  popup: {
    width: "100%",
    height: "80%",
    position: "absolute",
    top: 60, //padding for status bar
    left: "10%",
    right: "10%", //TODO: figure out why right isn't being used???
    bottom: "10%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  showContainer: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
  }
});

export default AddDestination;