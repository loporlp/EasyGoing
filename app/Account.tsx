// Account.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Switch } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { clearLocal } from '@/scripts/localStore';
import { getAuth } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

  const savedDestinations = () => {
    router.replace("/SavedDestinationsScreen")
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
    clearLocal()
  };

  /**
   * Email address
   */
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [optimizeRoutes, setOptimizeRoutes] = useState(false);
  const toggleSwitchOptimize = () => setOptimizeRoutes(previousState => !previousState)

  /**
   * Will get the current user's email address.
   */
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  // Gets the username
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const email = user.email;
      const extractedUsername = email.split('@')[0];
      setUsername(extractedUsername);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.accountContainer}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Settings</Text>

        <TouchableOpacity style={styles.accountDetails}>
          <Image source={require("../assets/images/blue.png")} style={styles.destinationImage} />
          <View style={{ flex: 1, flexDirection: "column", padding: 5, marginLeft: 5, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 10, marginTop: 15 }}>
              <Ionicons name="person" size={22} color={"#24a6ad"} />
              <Text style={{ fontSize: 22 }}>{username}</Text>
            </View>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
              <MaterialCommunityIcons name="email" size={16} color={"#24a6ad"} />
              {/* Display the user's email if logged in */}
              {userEmail ? (
                < Text style={styles.emailText} numberOfLines={1} ellipsizeMode='tail'>{userEmail}</Text>
              ) : (
                <Text style={styles.emailText}>No user logged in</Text>
              )}
            </View>

          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: "column", marginTop: 10 }}>
          <View style={styles.divider}></View>

          {/* Toggle slider for dark mode */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
              <MaterialCommunityIcons name={"circle-half-full"} size={18} color={"#24a6ad"} />
              <Text style={{ fontSize: 18, marginRight: 50 }}>Dark Mode</Text>
            </View>

            <Switch
              trackColor={{ false: '#767577', true: "#24a6ad" }}
              thumbColor={"#f4f4f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          <View style={styles.divider}></View>

          {/* Optimize Routes */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10 }}>
              <MaterialCommunityIcons name={"map-marker-distance"} size={18} color={"#24a6ad"} />
              <Text style={{ fontSize: 18, marginRight: 50 }}>Optimize Routes</Text>
            </View>

            <Switch
              trackColor={{ false: '#767577', true: "#24a6ad" }}
              thumbColor={"#f4f4f4"}
              onValueChange={toggleSwitchOptimize}
              value={optimizeRoutes}
            />
          </View>

          <View style={styles.divider}></View>

          <View style={{flexDirection: "column", alignItems: "center", paddingVertical: 10}}>
            {/* Sign-out button */}
            <TouchableOpacity onPress={handleSignOut} >
              <Text style={styles.signOut}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={{ padding: 10, marginLeft: 20 }} onPress={homeScreen}>
          <Ionicons name="home" size={30} color={"lightgray"} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} onPress={savedDestinations}>
          <Ionicons name="bookmark" size={30} color={"lightgray"} />
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
    </View >
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column"
  },

  accountContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 20,
    marginTop: 50
  },

  accountDetails: {
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#333333",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    flexDirection: "row",
    alignItems: "center"
  },

  emailText: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
    color: "gray"
  },

  signOut: {
    color: "red",
    fontSize: 18
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
  },

  destinationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    width: "100%"
  },
});

export default Account;