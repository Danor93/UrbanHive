import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import {
  fetchCommunityDetails,
  respondToJoinCommunityRequest,
} from "../utils/apiUtils"; // Ensure these are properly imported or adjusted based on your project structure

const CommunityManagerScreen = ({ route }) => {
  const { communityName } = route.params;
  const [joinRequests, setJoinRequests] = useState([]);
  const serverIP = useServerIP();
  const { user } = useUser();

  useEffect(() => {
    fetchCommunityDetails(serverIP, communityName)
      .then((data) => {
        // Check if join_request exists and is not null
        if (data.join_request) {
          // Wrap join_request in an array and set it to joinRequests state
          setJoinRequests([data.join_request]);
        } else {
          // Handle case where there are no join requests
          setJoinRequests([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch join requests:", error);
        Alert.alert("Error", "Failed to load join requests");
      });
  }, [serverIP, communityName]); // Ensure useEffect re-runs if serverIP or communityName changes

  const handleResponse = (requestId, response) => {
    respondToJoinCommunityRequest(serverIP, requestId, response)
      .then(() => {
        // Success: Filter out the request that was just responded to
        const updatedJoinRequests = joinRequests.filter(
          (request) => request.request_id !== requestId
        );
        setJoinRequests(updatedJoinRequests); // Update the state with the filtered list

        Alert.alert(
          "Success",
          `Request ${response === 1 ? "accepted" : "declined"}.`
        );
      })
      .catch((error) => {
        console.error("Failed to respond to join request:", error);
        Alert.alert(
          "Error",
          `Failed to ${response === 1 ? "accept" : "decline"} request.`
        );
      });
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <Text style={styles.greeting}>Hello, {user.name}</Text>
      {joinRequests.length > 0 && (
        <>
          <Text style={styles.title}>Requests to join {communityName}:</Text>
          <FlatList
            data={joinRequests}
            keyExtractor={(item) => item.request_id}
            renderItem={({ item }) => (
              <View style={styles.requestContainer}>
                <Text style={styles.requestText}>{item.sender_name}</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleResponse(item.request_id, 1)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.declineButton]}
                    onPress={() => handleResponse(item.request_id, 0)}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  requestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  requestText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: "#03af68",
  },
  declineButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "white",
  },
  greeting: {
    fontSize: 20,
    color: "white",
    fontFamily: "EncodeSansExpanded-Regular",
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    color: "white",
    fontFamily: "EncodeSansExpanded-Medium",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
});

export default CommunityManagerScreen;
