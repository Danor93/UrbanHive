import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import { respondToFriendRequest } from "../utils/apiUtils";

const MyRequestsScreen = ({ navigation }) => {
  const { user, addFriend, removeUserRequest } = useUser();
  const serverIP = useServerIP();
  const [requests, setRequests] = useState(user ? user.requests : []);

  useEffect(() => {
    // Update the requests if the user context changes
    setRequests(user ? user.requests : []);
  }, [user]);

  const handleResponse = async (senderId, userResponse) => {
    try {
      const response = await respondToFriendRequest(
        serverIP,
        user.id,
        senderId,
        userResponse
      );
      if (response.ok) {
        setRequests(requests.filter((req) => req.id !== senderId)); // Remove the request from the local state
        removeUserRequest(senderId); // Update the user context

        if (userResponse === 1) {
          const newFriend = {
            "friend id": senderId,
            "friend name": response.data.name,
          };
          addFriend(newFriend); //update user context friend list
        }
        Alert.alert("Success", "Response sent successfully");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No friend requests at the moment.</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{`Request from: ${item.name}`}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleResponse(item.id, 1)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleResponse(item.id, 0)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#7f5bf1", "#4689af", "#19ab7c"]}
        style={styles.container}
      >
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.sender_id}
          ListEmptyComponent={renderEmptyComponent}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Regular",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
  },
  backButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "60%",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default MyRequestsScreen;
