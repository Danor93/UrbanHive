import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import UrbanHiveLogo from "./assets/UrbanHive_Logo.jpg";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Set CreateAccountScreen as the initial screen */}
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// You can remove styles related to the HomeScreen since it's no longer needed
const styles = StyleSheet.create({
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
