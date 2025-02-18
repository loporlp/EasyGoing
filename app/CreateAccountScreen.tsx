// CreateAccountScreen.tsx
import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '@/scripts/databaseInteraction';

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateAccount'
>;

const CreateAccountScreen = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmedPassword, setViewConfirmedPassword] = useState(false);

  const handleCreateAccount = () => {
    if (!checkPassword()) {
      alert("Password do not match!")
      setPassword("");
      setConfirmPassword("");
      setEmail("");
    }

    else {
      createUserWithEmailAndPassword(auth, email.trim(), password)
        .then(() => {
          console.log('Account created!');
          registerUser();
          navigation.replace('Home');
        })
        .catch((error) => {
          console.error('Account creation error:', error);
          alert(error.message);
        });
    }
  };

  const checkPassword = () => {
    if (password == confirmPassword) {
      return true;
    }

    return false;
  };

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmInputRef = useRef(null);

  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image style={styles.backgroundImage} source={require("../assets/images/createTripImage.jpg")} />
      <View style={styles.darkOverlay} />

      {/* EasyGoing logo */}
      <Text style={{ color: "white", fontWeight: "bold", marginBottom: 20, fontSize: 25 }}>Easy<Text style={{ color: "#24a6ad", fontWeight: "bold" }}>Going</Text></Text>

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
          <Ionicons name="lock-closed" size={18} color={"#24a6ad"} style={{ marginRight: 15 }} />
          { (viewPassword) ? (
            <TextInput
            placeholder="Password"
            placeholderTextColor="#d6d6d6"
            value={password}
            onChangeText={setPassword}
            style={{ fontSize: 18, marginRight: 55 }}
            textContentType="password"
            ref={passwordInputRef}
          />
          ) : (
            <TextInput
            placeholder="Password"
            placeholderTextColor="#d6d6d6"
            value={password}
            onChangeText={setPassword}
            style={{ fontSize: 18, marginRight: 55 }}
            secureTextEntry
            textContentType="password"
            ref={passwordInputRef}
          />
          )}
          
          <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => { setViewPassword(!viewPassword) }}>
            {(viewPassword) ? (
              <Ionicons name="eye" size={18} color={"#24a6ad"} style={{ marginLeft: 15 }} />
            ) : (
              <Ionicons name="eye-off" size={18} color={"#24a6ad"} style={{ marginLeft: 15 }} />
            )}
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputUserPass}>
        <TouchableWithoutFeedback onPress={() => passwordConfirmInputRef.current.focus()}>
        <View style={styles.userPassTextInput}>
          <Ionicons name="lock-closed" size={18} color={"#24a6ad"} style={{ marginRight: 15 }} />
          { (viewConfirmedPassword) ? (
            <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#d6d6d6"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={{ fontSize: 18, marginRight: 55 }}
            textContentType="password"
            ref={passwordConfirmInputRef}
          />
          ) : (
            <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#d6d6d6"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={{ fontSize: 18, marginRight: 55 }}
            secureTextEntry
            textContentType="password"
            ref={passwordConfirmInputRef}
          />
          )}

          <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => { setViewConfirmedPassword(!viewConfirmedPassword) }}>
            {(viewConfirmedPassword) ? (
              <Ionicons name="eye" size={18} color={"#24a6ad"} style={{ marginLeft: 15 }} />
            ) : (
              <Ionicons name="eye-off" size={18} color={"#24a6ad"} style={{ marginLeft: 15 }} />
            )}
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleCreateAccount}>
        <Text style={styles.signInText}>Start Planning!</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "white", fontSize: 15, marginTop: 15 }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
          <Text style={{ color: "#24a6ad", fontSize: 15, marginTop: 15 }}>Sign In</Text>
        </TouchableOpacity>
      </View>
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

export default CreateAccountScreen;
