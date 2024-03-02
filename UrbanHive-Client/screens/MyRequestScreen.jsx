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

const MyRequestsScreen = ({ navigation }) => {
  const { user } = useUser();
  const serverIP = useServerIP();
  const [requests, setRequests] = useState(user ? user.requests : []);

  useEffect(() => {
    // Update the requests if the user context changes
    setRequests(user ? user.requests : []);
  }, [user]);

  const handleResponse = async (sender_id, response) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id: user.id,
          sender_id: user.requests.sender_id,
          response: response,
        }),
      };

      const response = await fetch(
        `${serverIP}/user/respond-to-request`,
        requestOptions
      );

      if (response.ok) {
        Alert.alert("Success", "Response sent successfully");
        // Update the requests state to reflect the change
        setRequests(requests.filter((req) => req.sender_id !== sender_id));
      } else {
        Alert.alert("Error", "Failed to send response");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while sending response");
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
          onPress={() => handleResponse(item.sender_id, 1)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleResponse(item.sender_id, 0)}
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
    paddingTop: 22,
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "48%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  emptyText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 40,
    width: 100,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MyRequestsScreen;
