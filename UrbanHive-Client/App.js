import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import UrbanHiveLogo from "./assets/UrbanHive_Logo.jpg"; // Make sure the path is correct

export default function App() {
  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={UrbanHiveLogo} />
      <View style={styles.centeredContent}>
        <Text style={styles.labelText}>Welcome to UrbanHive!</Text>
      </View>
      <StatusBar style="auto" />
    </View>
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
    width: 200, // Set a width for the image
    height: 200, // Set a height for the image
    resizeMode: "contain", // Adjust the resizeMode as needed
  },
});
