import { Stack } from "expo-router";
import Flag from "react-native-flags";
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

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
        }}
      />

      {/*Account screen*/}
      <Stack.Screen name="Account" />

      {/*Home screen*/}
      <Stack.Screen name="HomeScreen"
        options={{
          title: "Home",
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} />

      {/*Create New Trip screen*/}
      <Stack.Screen
        name="CreateNewTrip"
        options={{
          title: "Create New Trip",
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/*Add / Edit Destinations screen*/}
      <Stack.Screen
        name="AddEditDestinations"
        options={{
          headerTitle: () => (
            <View style={styles.titleContainer}>
              {/* City and Country Name */}
              <Text style={styles.headerText}>{placeName || 'Tokyo, Japan'}</Text> 
              {/* Country Flag */}
              <Flag code="JP" style={styles.flag} />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
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
          headerTitle: () => (
            <View style={styles.titleContainer}>
              {/* City and Country Name */}
              <Text style={styles.headerText}>{placeName || 'Tokyo, Japan'}</Text> 
              {/* Country Flag */}
              <Flag code="JP" style={styles.flag} />
            </View>
          ),
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
        name="ReviewItineraryScreen"
        options={{
          title: "Review Trip",
          headerStyle: {
            backgroundColor: '#24a6ad',
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
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