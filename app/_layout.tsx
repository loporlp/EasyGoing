import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"
                    options={{title: "Home"}}/>
      <Stack.Screen name="Account" />
      <Stack.Screen name="HomeScreen" />
      <Stack.Screen name="SignInScreen" />
      <Stack.Screen name="CreateNewTrip" 
                    options={{title: "Create New Trip"}}/>
    </Stack>
  );
}
