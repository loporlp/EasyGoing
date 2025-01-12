// SignInScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { fetchData } from '../scripts/fetchData';

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
    try {
      const isServerRunning = await fetchData();
  
      if (!isServerRunning) {
        alert('Server is down. Please try again later.');
        router.replace("/ConnectionToServerFailedScreen");
        return;
      }
  
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('User signed in!');
  
      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      console.log("🔥 Firebase ID Token:", idToken);
  
      alert(`Your Firebase Token:\n${idToken}`);
  
      // Now you can use this token in Postman for API testing
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      alert(error.message);
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
