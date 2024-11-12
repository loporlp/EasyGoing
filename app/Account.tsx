// Account.tsx
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

const Account = () => {

    const navigation = useNavigation();

    /**
     * Signs the user out of their account. 
     */
    const handleSignOut = () => {
      signOut(auth)
      .then(() => {
        // This clears the navigation stack, making it impossible for a user to 
        // go back to their account just by going back.
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "index" }] // redirects user to the "Sign In" page
            })
        );
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });

    };

    /**
     * Email address
     */
    const [userEmail, setUserEmail] = useState<string | null>(null);

    /**
     * Will get the current user's email address.
     */
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
            <TouchableOpacity onPress={ handleSignOut }>
                <Text style={styles.signOut}>Sign Out</Text>
            </TouchableOpacity>
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
        signOut: {
            
        }
      });

export default Account;