// CreateAccountScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateAccount'
>;

const CreateAccountScreen = () => {
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        console.log('Account created!');
        navigation.replace('Home');
      })
      .catch((error) => {
        console.error('Account creation error:', error);
        alert(error.message);
      });
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
        placeholder="Password (6+ characters)"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        textContentType="newPassword"
      />
      <Button title="Create Account" onPress={handleCreateAccount} />
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

export default CreateAccountScreen;
