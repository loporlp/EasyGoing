// Account.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

const Account = () => {

  const navigation = useNavigation();
  const router = useRouter();

  const viewTrips = () => {
    router.replace("/EditExistingTripsScreen")
  }

  const homeScreen = () => {
    router.replace("/HomeScreen")
  }

  const searchScreen = () => {
    router.replace("/SearchScreen")
  }

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
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={styles.container}>
        {/* Display the user's email if logged in */}
        {userEmail ? (
          <Text style={styles.emailText}>Email: {userEmail}</Text>
        ) : (
          <Text style={styles.emailText}>No user logged in</Text>
        )}

        {/* Sign-out button */}
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
          <Ionicons name="home" size={30} color={"lightgray"} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} onPress={searchScreen}>
          <Ionicons name="search" size={30} color={"lightgray"} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} onPress={viewTrips}>
          <Ionicons name="calendar" size={30} color={"lightgray"} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, marginRight: 20 }}>
          <Ionicons name="person" size={30} color={"#24a6ad"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
  },
  signOut: {
    color: "red",
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    height: "8%",
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});

export default Account;