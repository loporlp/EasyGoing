// Account.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

const Account = () => {

    const navigation = useNavigation();

    const handleSignOut = () => {
      signOut(auth)
      .then(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "SignInScreen" }]
            })
        );
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });

    };

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);
  
    return (
        <View style={styles.container}>
          {/* Display the user's email if logged in */}
          {userEmail ? (
            <Text style={styles.emailText}>Email: {userEmail}</Text>
          ) : (
            <Text style={styles.emailText}>No user logged in</Text>
          )}
          
          {/* Sign-out button */}
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      );
    };
  
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        emailText: {
          fontSize: 18,
          marginBottom: 20,
        },
      });

export default Account;