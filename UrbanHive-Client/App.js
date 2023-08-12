import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UrbanHiveLogo from "./assets/UrbanHive_Logo.jpg";

// Screen components
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={UrbanHiveLogo} />
      <View style={styles.centeredContent}>
        <Text style={styles.labelText}>Welcome to UrbanHive!</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate("Details")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -100,
    textDecorationLine: "underline",
    color: "red",
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
