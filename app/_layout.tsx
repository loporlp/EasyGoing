import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"
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
      <Stack.Screen name="Account" />
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="SignInScreen" />
      <Stack.Screen name="CreateNewTrip"
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
      <Stack.Screen name="AddEditDestinations"
        options={{
          // The title should be the city the user wants to go to
          title: "Tokyo, Japan",
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
  );
}
