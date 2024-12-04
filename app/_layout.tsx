import { Stack } from "expo-router";
import Flag from "react-native-flags";
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [placeName, setPlaceName] = useState<string | undefined>(undefined);

  const router = useRouter();

  // Use effect to update placeName once router.query is populated
  useEffect(() => {
      console.log("Router.query:", router.query);
      if (router.isReady && router.query?.placeName) {
          setPlaceName(router.query.placeName as string);
      }
  }, [router, router.query, router.isReady]);


  return (
    <Stack>

      {/*Login screen*/}
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
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

      {/*Sign In screen*/}
      <Stack.Screen name="SignInScreen"
        options={{
          title: "Sign In",
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
              <Text style={styles.headerText}>{placeName || 'Tokyo, Japan'}</Text> // TODO: "No place selected"
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
              <Text style={styles.headerText}>{placeName || 'No place selected'}</Text>
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