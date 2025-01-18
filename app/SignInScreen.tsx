// SignInScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { fetchData } from '../scripts/fetchData';
import { Ionicons } from '@expo/vector-icons';

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles sign-in and server connection checks.
   */
  const handleSignIn = async () => {
    const isServerRunning = await fetchData();

    if (isServerRunning) {
      signInWithEmailAndPassword(auth, email.trim(), password)
        .then(() => {
          console.log('User signed in!');
          // Navigate to the next screen, e.g., Home
        })
        .catch((error) => {
          console.error('Sign in error:', error);
          alert(error.message);
        });
    } else {
      alert('Server is down. Please try again later.');
      router.replace("/ConnectionToServerFailedScreen");
    }
  };


  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />
      <View style={styles.darkOverlay} />

      {/* EasyGoing logo */}
      <Text style={{ color: "white", fontWeight: "bold", marginBottom: 20, fontSize: 25 }}>Easy<Text style={{ color: "#24a6ad", fontWeight: "bold" }}>Going</Text></Text>

      {/* Username */}
      <View style={styles.inputUserPass}>
        <View style={styles.userPassTextInput}>
          <Ionicons name="person" size={18} color={"#24a6ad"} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#d6d6d6"
            value={email}
            onChangeText={setEmail}
            style={{ fontSize: 18 }}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputUserPass}>
        <View style={styles.userPassTextInput}>
          <Ionicons name="lock-closed" size={18} color={"#24a6ad"} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#d6d6d6"
            value={password}
            onChangeText={setPassword}
            style={{ fontSize: 18 }}
            secureTextEntry
            textContentType="password"
          />
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      {/* Create New Account Button */}
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={{ color: "white", fontSize: 15, marginTop: 15 }}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center",
  },

  // ---- BACKGROUND ----//
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute"
  },

  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  // ---- USERNAME/PASSWORD FIELDS ---- //
  inputUserPass: {
    flexDirection: "row",
    width: "80%",
    marginTop: 15,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  userPassTextInput: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center"
  },

  // ---- SIGN IN BUTTON ---- //
  signInButton: {
    backgroundColor: "#24a6ad",
    width: "80%",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  signInText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 40,
    marginRight: 40,
  }
});

export default SignInScreen;