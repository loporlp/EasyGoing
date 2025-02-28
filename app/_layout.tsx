import { Stack } from "expo-router";
import Flag from "react-native-flags";
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";

export default function RootLayout() {
  const [placeName, setPlaceName] = useState<string | undefined>(undefined);

  return (
    <Stack>

      {/*Login screen*/}
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/*Edit existing trips screen*/}
      <Stack.Screen
        name="EditExistingTripsScreen"
        options={{
          title: "Edit Existing Trips",
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
          animation: "none"
        }}
      />

      {/*Settings screen*/}
      <Stack.Screen name="Settings"
        options={{
          headerShown: false,
          animation: "none"
        }} />

      {/*Home screen*/}
      <Stack.Screen name="HomeScreen"
        options={{
          headerShown: false,
          animation: "none"
        }} />

      {/* Search screen */}
      <Stack.Screen
        name="SearchScreen"
        options={{
          headerShown: false,
          animation: "none"
        }} />

      {/*Create New Trip screen*/}
      <Stack.Screen
        name="CreateNewTrip"
        options={{
          headerShown: false,
        }}
      />

      {/* Account screen */}
      <Stack.Screen 
        name="Account"
        options={{
          headerShown: false
        }}
      />

      {/* Saved Desstinations screen */}
      <Stack.Screen 
        name = "SavedDestinationsScreen"
        options={{
          headerShown: false,
          animation: "none"
        }}
      />

      {/*Add / Edit Destinations screen*/}
      <Stack.Screen
        name="AddEditDestinations"
        options={{
          headerShown: false,
        }}
      />

      {/* Notifications screen */}
      <Stack.Screen
        name="NotificationsScreen"
        options={{
          headerShown: false,
        }}
      />

      {/*Connection to server failed screen*/}
      <Stack.Screen
        name="ConnectionToServerFailedScreen"
        options={{
          title: "Error",
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="GenerateItineraryScreen"
        options={{
          headerShown: false,
          animation: "none"
        }} />

      <Stack.Screen
        name="ReviewItineraryScreen"
        options={{
          headerShown: false,
          animation: "none"
        }} />
    </Stack>
  )
};

const styles = StyleSheet.create({
  // ==== ADD/EDIT DESTINATIONS SCREEN TITLE ==== //
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  flag: {
    width: 22,
    height: 22,
  },
})