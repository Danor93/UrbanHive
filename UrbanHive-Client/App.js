import React from "react";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import UrbanHiveLogo from "./assets/UrbanHive_Logo.jpg";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import CommunityHubScreen from "./screens/CommunityHubScreen";
import CommunityLobby from "./screens/CommunityLobby";
import CommunityMembersScreen from "./screens/CommunityMembers";
import CommunityPublishPost from "./screens/CommunityPublishPost";
import CommunityCreateEvent from "./screens/CommunityCreateEvent";
import CommunityJoinEventScreen from "./screens/CommunityJoinEvent";
import CommunityManagerScreen from "./screens/CommunityManagerScreen";
import CommunityNightWatch from "./screens/CommunityNightWatch";
import HomeScreen from "./screens/HomeScreen";
import FriendList from "./screens/FriendList";
import MyRequestsScreen from "./screens/MyRequestScreen";
import useFonts from "./utils/hooks/useFonts";
import { ServerIPProvider } from "./contexts/ServerIPContext";
import { UserProvider } from "./contexts/UserContext";
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
]);

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
    <UserProvider>
      <ServerIPProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginScreen">
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
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityHubScreen"
              component={CommunityHubScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FriendList"
              component={FriendList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MyRequestsScreen"
              component={MyRequestsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityLobby"
              component={CommunityLobby}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityMembersScreen"
              component={CommunityMembersScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityPublishPost"
              component={CommunityPublishPost}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityCreateEvent"
              component={CommunityCreateEvent}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityJoinEventScreen"
              component={CommunityJoinEventScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityManagerScreen"
              component={CommunityManagerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommunityNightWatch"
              component={CommunityNightWatch}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ServerIPProvider>
    </UserProvider>
  );
}
