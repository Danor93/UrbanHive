import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DatePicker from "react-native-date-picker";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchCommunityDetails,
  respondToJoinCommunityRequest,
  createNewNightWatch,
  fetchNightWatchesByCommunity,
  closeNightWatch,
} from "../utils/apiUtils";

const CommunityManagerScreen = ({ route }) => {
  const { communityName } = route.params;
  const [joinRequests, setJoinRequests] = useState([]);
  const serverIP = useServerIP();
  const { user } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [watchDate, setWatchDate] = useState(new Date());
  const [watchRadius, setWatchRadius] = useState("");
  const [positionsAmount, setPositionsAmount] = useState("");
  const [nightWatches, setNightWatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Start loading
    Promise.all([
      fetchCommunityDetails(serverIP, communityName),
      fetchNightWatchesByCommunity(serverIP, communityName),
    ])
      .then(([communityDetails, nightWatchesData]) => {
        if (communityDetails.join_request) {
          setJoinRequests([communityDetails.join_request]);
        } else {
          setJoinRequests([]);
        }
        if (nightWatchesData.night_watches) {
          setNightWatches(nightWatchesData.night_watches);
        } else {
          setNightWatches([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to load data");
        setIsLoading(false); // Ensure loading is stopped on error
      });
  }, [serverIP, communityName]);

  // Function to handle form submission
  const handleCreateNightWatch = () => {
    // Validate inputs if necessary
    const newNightWatch = {
      initiator_id: user.id,
      community_area: communityName,
      watch_date: watchDate.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      watch_radius: watchRadius,
      positions_amount: positionsAmount,
    };
    createNewNightWatch(serverIP, newNightWatch)
      .then((response) => {
        // Handle success response
        Alert.alert(response);
        setModalVisible(false); // Close the modal
      })
      .catch((error) => {
        // Handle error response
        Alert.alert("Error", "Failed to create night watch.");
      });
  };

  const closeNightWatchHandler = (watchId) => {
    closeNightWatch(serverIP, watchId)
      .then((response) => {
        Alert.alert("Success", "Night watch closed successfully.");
        setNightWatches((currentWatches) =>
          currentWatches.filter((watch) => watch.watch_id !== watchId)
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to close night watch.");
      });
  };

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

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.openButton}
      >
        <Ionicons name="add-outline" size={20} color="white" />
        <Text style={styles.openButtonText}>Open a New Night Watch</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Modal content with form inputs and submit button */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Watch Date:</Text>
              <DatePicker
                date={watchDate}
                onDateChange={setWatchDate}
                mode="date"
                theme="light"
                textColor="black"
                androidVariant="iosClone"
              />
            </View>
            <Text style={styles.label}>Watch Radius (km):</Text>
            <TextInput
              placeholder="Watch Radius"
              value={watchRadius}
              onChangeText={setWatchRadius}
              keyboardType="numeric"
              style={styles.textInput}
            />
            <Text style={styles.label}>Positions Amount:</Text>
            <TextInput
              placeholder="Positions Amount"
              value={positionsAmount}
              onChangeText={setPositionsAmount}
              keyboardType="numeric"
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={handleCreateNightWatch}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.nightWatchesTitle}>
        {communityName} Night Watches:
      </Text>

      <FlatList
        data={nightWatches}
        keyExtractor={(item, index) => `nightWatch-${index}`}
        renderItem={({ item }) => (
          <View style={styles.nightWatchContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View>
                <Text
                  style={[
                    styles.nightWatchDetailText,
                    { fontFamily: "EncodeSansExpanded-Bold" },
                  ]}
                >
                  Area:
                </Text>
                <Text style={styles.nightWatchDetailText}>
                  {item.community_area}
                </Text>
                <Text
                  style={[
                    styles.nightWatchDetailText,
                    { fontFamily: "EncodeSansExpanded-Bold" },
                  ]}
                >
                  Date:
                </Text>
                <Text style={styles.nightWatchDetailText}>
                  {item.watch_date}
                </Text>
                <Text
                  style={[
                    styles.nightWatchDetailText,
                    { fontFamily: "EncodeSansExpanded-Bold" },
                  ]}
                >
                  Radius:
                </Text>
                <Text style={styles.nightWatchDetailText}>
                  {item.watch_radius} km
                </Text>
                <Text
                  style={[
                    styles.nightWatchDetailText,
                    { fontFamily: "EncodeSansExpanded-Bold" },
                  ]}
                >
                  Positions:
                </Text>
                <Text style={styles.nightWatchDetailText}>
                  {item.positions_amount}
                </Text>
                <Text
                  style={[
                    styles.nightWatchDetailText,
                    { fontFamily: "EncodeSansExpanded-Bold" },
                  ]}
                >
                  Initiator:
                </Text>
                <Text style={styles.nightWatchDetailText}>
                  {item.initiator_name}
                </Text>
                {item.watch_members && item.watch_members.length > 0 && (
                  <Text
                    style={[
                      styles.nightWatchDetailText,
                      { fontFamily: "EncodeSansExpanded-Bold" },
                    ]}
                  >
                    Members:
                  </Text>
                )}
                {item.watch_members.map((member, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.memberDetailText,
                      { fontFamily: "EncodeSansExpanded-Regular" },
                    ]}
                  >
                    {member.name}
                  </Text>
                ))}
              </View>
              <TouchableOpacity
                style={styles.closeButtonStyle}
                onPress={() => {
                  Alert.alert(
                    "Close Night Watch",
                    "Are you sure you want to remove this night watch?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Yes",
                        onPress: () => closeNightWatchHandler(item.watch_id),
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
  nightWatchContainer: {
    flexDirection: "column",
    backgroundColor: "white",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
  },
  requestText: {
    fontSize: 16,
  },
  nightWatchesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "EncodeSansExpanded-Bold",
    marginVertical: 10,
    marginLeft: 16,
    textDecorationLine: "underline",
  },
  nightWatchDetailText: {
    fontSize: 12,
    marginBottom: 2,
    fontFamily: "EncodeSansExpanded-Regular",
  },
  memberDetailText: {
    fontSize: 10,
    marginLeft: 20,
    marginBottom: 2,
    fontFamily: "EncodeSansExpanded-Regular",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#FD844D",
  },
  acceptButton: {
    backgroundColor: "#03af68",
  },
  declineButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "white",
    fontFamily: "EncodeSansExpanded-Medium",
  },
  greeting: {
    fontSize: 20,
    color: "white",
    fontFamily: "EncodeSansExpanded-Regular",
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    color: "white",
    fontFamily: "EncodeSansExpanded-Medium",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
  },
  label: {
    alignSelf: "flex-start",
    marginVertical: 8,
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Medium",
    color: "#000",
  },
  textInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  createButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-ExtraBold",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 30,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  openButton: {
    backgroundColor: "#FD844D",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    width: "60%",
  },
  openButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "EncodeSansExpanded-ExtraBold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nightWatchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 10,
  },
  closeButtonStyle: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  nightWatchDetailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  memberDetailText: {
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 2,
  },
});

export default CommunityManagerScreen;
