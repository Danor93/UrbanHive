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
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import { addFriend } from "../utils/apiUtils";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const serverIP = useServerIP();

  useEffect(() => {
    getUserFriend();
  }, []);

  const getUserFriend = async () => {
    try {
      setFriends(user.friends || []);
      console.log("friend list:", user.friends);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const addFriendHandler = async () => {
    try {
      const userId = await SecureStore.getItemAsync("user_id");
      const successMessage = await addFriend(serverIP, userId, receiverId);
      Alert.alert("Success", successMessage);
      setModalVisible(false);
      getUserFriend(); // Refresh the friend list
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
                    {item["friend location"] && item["friend location"].address
                      ? item["friend location"].address
                      : "Address not available"}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addFriendButton}
        >
          <Text style={styles.buttonText}>Add a friend</Text>
        </TouchableOpacity>
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
          <Button title="Submit" onPress={addFriendHandler} />
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
    alignSelf: "center",
    width: "70%",
    marginTop: 20,
  },
  buttonText: {
    fontFamily: "EncodeSansExpanded-Bold",
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontFamily: "EncodeSansExpanded-Bold",
    fontSize: 16,
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
