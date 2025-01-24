// index.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import SignInScreen from './SignInScreen';
import CreateAccountScreen from './CreateAccountScreen';
import { RootStackParamList } from './types';
import HomeScreen from './HomeScreen';
import TestHomeScreen from './HomeScreen_API_Test';
import TestOptScreen from './TestOptimalRouteScreen';
import GenerateItineraryScreen from './GenerateItineraryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  if (loading) {
    // Show a loading indicator while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Remove NavigationContainer from here
    // <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User is signed in
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false,
              title: "Home"
             }}
          />
        ) : (
          // User is not signed in
          <>
            <Stack.Screen
              name="SignIn"
              component={HomeScreen} 
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
              options={{ headerShown: false, animation: "none" }}
            />
          </>
        )}
      </Stack.Navigator>
    // </NavigationContainer> // Remove this closing tag as well
  );
};

export default Index;
