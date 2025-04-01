// SignInScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { fetchData } from '../scripts/fetchData';
import { Ionicons } from '@expo/vector-icons';
import { CrossfadeImage } from 'react-native-crossfade-image';

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
    try {
      const isServerRunning = await fetchData();

      if (!isServerRunning) {
        alert('Server is down. Please try again later.');
        router.replace("/ConnectionToServerFailedScreen");
        return;
      }

      // Sign in 
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('User signed in!');

      // Get the Firebase ID
      const idToken = await userCredential.user.getIdToken();
      console.log("Firebase ID Token:", idToken);

    } catch (error: any) {
      console.error('Sign in error:', error.message);
      alert(error.message);
    }
  };

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const images = [
    require("../assets/images/createTripImage.jpg"),
    require("../assets/images/city.jpg"),
    require("../assets/images/airplane.jpg"),
    require("../assets/images/hotel.jpg"),
    require("../assets/images/venice.jpg"),
    require("../assets/images/food.jpg"),
  ]

  const [imageSource, setImageSource] = useState(images[0]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageSource((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;  // Loop back to the first image after the last one
        return images[nextIndex];
      });
    }, 6000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background image */}
      <CrossfadeImage style={styles.backgroundImage} source={imageSource} resizeMode="cover" />
      <View style={styles.darkOverlay} />

      {/* EasyGoing logo */}
      <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 5, marginBottom: 15}}>
        <Image style={styles.logoImage} source={require("../assets/images/icon.png")} />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>Easy<Text style={{ color: "#24a6ad", fontWeight: "bold" }}>Going</Text></Text>
      </View>

      {/* Username */}
      <View style={styles.inputUserPass}>
        <TouchableWithoutFeedback onPress={() => emailInputRef.current.focus()}>
          <View style={styles.userPassTextInput}>
            <Ionicons name="person" size={18} color={"#24a6ad"} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#d6d6d6"
              value={email}
              onChangeText={setEmail}
              style={{ fontSize: 18, marginHorizontal: 15 }}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              ref={emailInputRef}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Password */}
      <View style={styles.inputUserPass}>
        <TouchableWithoutFeedback onPress={() => passwordInputRef.current.focus()}>
          <View style={styles.userPassTextInput}>
            <Ionicons name="lock-closed" size={18} color={"#24a6ad"} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#d6d6d6"
              value={password}
              onChangeText={setPassword}
              style={{ fontSize: 18, marginHorizontal: 15 }}
              secureTextEntry
              textContentType="password"
              ref={passwordInputRef}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      {/* Create New Account Button */}
      <TouchableOpacity onPress={() => navigation.replace('CreateAccount')}>
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

  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 10
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
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "white",
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