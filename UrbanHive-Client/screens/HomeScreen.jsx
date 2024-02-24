import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useServerIP } from "../contexts/ServerIPContext";
import * as SecureStore from "expo-secure-store";

const HomeScreen = ({ navigation }) => {
  // const { username } = route.params || "Danor";
  const [user, setUser] = useState(null);
  const serverIP = useServerIP();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      const response = await fetch(`${serverIP}/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      console.log("userData:", userData);
      setUser(userData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const ProfileImage = () => {
    // TODO: grab the image url from the user database on the server
    return (
      <Image
        source={require("../assets/images/Empty_Profile.png")}
        style={styles.profileImage}
      />
    );
  };

  return (
    <LinearGradient
      colors={["#7f5bf1", "#4689af", "#19ab7c"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.greetingText}>
          Hello, {user ? user.name : "User"}
        </Text>

        <View style={styles.headerContainer}>
          <Text style={styles.homeTitle}>UrbanHive</Text>
        </View>

        {/* Profile Image on the top right */}
        <View style={styles.profileImageView}>
          <ProfileImage />
        </View>

        {/* Menu View */}
        <View style={styles.menu}>
          {/*TODO: make the functionalty of those buttons. */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityScreen");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Communities Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("FriendList");
            }}
            style={styles.button}
          >
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
  headerContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  homeTitle: {
    fontSize: 30,
    color: "white",
    fontFamily: "EncodeSansExpanded-Bold",
    marginTop: 50,
  },
  profileImageView: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
    marginTop: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  greetingText: {
    fontSize: 24,
    color: "white",
    fontFamily: "EncodeSansExpanded-Bold",
    marginTop: 15,
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
    width: "90%",
    alignSelf: "center",
  },
  exitButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default HomeScreen;
