import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import UrbanHiveLogo from "./assets/UrbanHive_Logo.jpg";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import useFonts from "./utils/hooks/useFonts";

const Stack = createStackNavigator();

export default function App() {
  const fontsLoaded = useFonts({
    "EncodeSansExpanded-Black": require("./assets/fonts/EncodeSansExpanded-Black.ttf"),
    "EncodeSansExpanded-Bold": require("./assets/fonts/EncodeSansExpanded-Bold.ttf"),
    "EncodeSansExpanded-ExtraBold": require("./assets/fonts/EncodeSansExpanded-ExtraBold.ttf"),
    "EncodeSansExpanded-ExtraLight": require("./assets/fonts/EncodeSansExpanded-ExtraLight.ttf"),
    "EncodeSansExpanded-Light": require("./assets/fonts/EncodeSansExpanded-Light.ttf"),
    "EncodeSansExpanded-Medium": require("./assets/fonts/EncodeSansExpanded-Medium.ttf"),
    "EncodeSansExpanded-Regular": require("./assets/fonts/EncodeSansExpanded-Regular.ttf"),
    "EncodeSansExpanded-SemiBold": require("./assets/fonts/EncodeSansExpanded-SemiBold.ttf"),
    "EncodeSansExpanded-Thin": require("./assets/fonts/EncodeSansExpanded-Thin.ttf"),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Set CreateAccountScreen as the initial screen */}
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
