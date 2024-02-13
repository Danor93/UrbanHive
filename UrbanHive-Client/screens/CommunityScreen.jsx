import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const CommunityScreen = () => {
  // TODO: grab the members from the server.
  const onlineMembers = [
    { id: "1", name: "Aaron Loeb" },
    { id: "2", name: "Adeline Palmerston" },
    { id: "3", name: "Daniel Gallego" },
    { id: "4", name: "Juliana Silva" },
    { id: "5", name: "Pedro Fernandes" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Ionicons name="person-circle" size={40} color="white" />
      <Text style={styles.memberName}>{item.name}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, Moshe</Text>
        <Image
          source={require("../assets/images/Empty_Profile.png")}
          style={styles.profilePicture}
        />
      </View>

      <Text style={styles.communityName}>Community name</Text>

      <View style={styles.locationContainer}>
        <Ionicons name="location-sharp" size={20} color="red" />
        <Text style={styles.locationText}>Snunit, Karmiel</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="people"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Show Members</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="calendar"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="body"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Join Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="clipboard"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Publish Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons
            name="moon"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Night Watch</Text>
        </TouchableOpacity>
      </View>

      {/* Online Members List */}
      <Text style={styles.onlineMembersTitle}>Online Members</Text>
      <FlatList
        data={onlineMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.membersList}
      />

      {/* Back to Home Page Button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home Page</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "EncodeSansExpanded-Bold",
    color: "white",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    fontFamily: "EncodeSansExpanded-Light",
    color: "white",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  communityName: {
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-SemiBold",
    color: "white",
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: "50%",
    marginBottom: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  onlineMembersTitle: {
    fontSize: 18,
    fontFamily: "EncodeSansExpanded-SemiBold",
    color: "black",
    marginTop: 20,
  },
  membersList: {
    flexGrow: 0,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memberName: {
    color: "black",
    fontFamily: "EncodeSansExpanded-Regular",
    marginLeft: 10,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "50%",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CommunityScreen;
