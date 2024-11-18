// SignInScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const fetchData = async () => {
    try {
      // We should put this ip into a global constant
      const response = await fetch('http://3.145.147.136:3000/api/serverstatus');
      const data = await response.json();
      console.log(data.message); // This should log "Server is Running"
      return true;

    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        textContentType="password"
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button
        title="Create an Account"
        onPress={() => navigation.navigate('CreateAccount')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#999',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default SignInScreen;
