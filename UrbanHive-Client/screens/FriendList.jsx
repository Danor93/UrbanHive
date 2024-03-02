import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Button,
  Alert,
  Modal,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { useServerIP } from "../contexts/ServerIPContext";
import * as Location from "expo-location";
import { useUser } from "../contexts/UserContext";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const serverIP = useServerIP();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      setFriends(user.friends || []);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const addFriend = async () => {
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      const response = await fetch(`${serverIP}/user/add-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: receiverId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add friend");
      }
      Alert.alert("Success", "Friend added successfully");
      setModalVisible(false);
      getUserDetails(); // Refresh friend list
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#7f5bf1", "#4689af", "#19ab7c"]}
        style={styles.background}
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a friend..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {isLoading ? (
          // Consider using a more visually appealing loading indicator like ActivityIndicator
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading friends...</Text>
          </View>
        ) : (
          <FlatList
            data={friends.filter((friend) =>
              friend["friend name"]
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Image
                  source={require("../assets/images/Empty_Profile.png")}
                  style={styles.profileImage}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{item["friend name"]}</Text>
                  {/* Check if item.location and item.location.address exist before displaying */}
                  <Text style={styles.friendLocation}>
                    Location:{" "}
                    {item.location && item.location.address
                      ? item.location.address
                      : "Address not available"}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
        <Button
          style={styles.addFriendButton}
          title="Add a friend"
          onPress={() => setModalVisible(true)}
        />
      </LinearGradient>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Enter friend's user ID"
            value={receiverId}
            onChangeText={setReceiverId}
            style={styles.input}
          />
          <Button title="Submit" onPress={addFriend} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    marginTop: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  addFriendButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "50%",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // Change this as needed
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    borderRadius: 25, // Make it round
    marginRight: 10,
  },
  friendName: {
    fontFamily: "EncodeSansExpanded-Bold", // Make sure this font is linked in your project
    fontSize: 16, // Adjust size as needed
  },
  friendLocation: {
    fontFamily: "EncodeSansExpanded-Bold",
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  friendDetails: {
    flex: 1,
  },
});

export default FriendList;
