import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Assuming you have a profile image component
const ProfileImage = () => {
  return (
    <Image
      // source={require("./path-to-your-profile-image.png")}
      style={styles.profileImage}
    />
  );
};

const HomeScreen = ({ route }) => {
  // const { username } = route.params || "Danor";
  const username = "Danor";

  return (
    <LinearGradient
      colors={["#7f5bf1", "#4689af", "#19ab7c"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Absolute positioned header */}
        <Text style={styles.greetingText}>Hello, {username}</Text>
        {/* Menu View */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Communities Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Friend list</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>My Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton}>
            <Text style={styles.buttonText}>Exit System</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    color: "white",
    position: "absolute",
    top: 16, // Adjust top as needed
    left: 16, // Adjust left as needed
    zIndex: 10, // Make sure it's above other elements
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "90%", // Adjust based on your design
    alignSelf: "center",
  },
  exitButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "90%", // Adjust based on your design
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default HomeScreen;
