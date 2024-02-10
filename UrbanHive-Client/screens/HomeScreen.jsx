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

const HomeScreen = ({ route }) => {
  // const { username } = route.params || "Danor";
  //TODO: Grab the username from the server and save it with expo secrue store.
  const username = "Danor";

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
        <Text style={styles.greetingText}>Hello, {username}</Text>

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
