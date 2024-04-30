import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Import custom hooks for accessing user data and server IP
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";

// Import API utility functions for community-related actions
import {
  createCommunity,
  findCommunitiesByRadiusAndLocation,
  fetchAllCommunities,
  requestToJoinCommunity,
} from "../utils/apiUtils";

// Get dimensions of the device screen
const { width, height } = Dimensions.get("window");

// Main component for managing community interactions
const CommunityLobby = ({ navigation }) => {
  const { user, updateUserCommunities } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [communities, setCommunities] = useState([]);
  const [displayedCommunities, setDisplayedCommunities] = useState([]);
  const [action, setAction] = useState("");
  const serverIP = useServerIP();

  const userId = user.id;

  // useEffect to fetch all communities from the server on component mount
  useEffect(() => {
    // Call the function to fetch all communities when the component mounts
    const loadCommunities = async () => {
      try {
        const fetchedCommunities = await fetchAllCommunities(serverIP);
        setCommunities(fetchedCommunities.communities);
      } catch (error) {
        Alert.alert("Error", "Failed to load communities");
      }
    };

    loadCommunities();
  }, [serverIP]);

  // Navigation function to the community hub
  const navigateToCommunity = (communityName) => {
    navigation.navigate("CommunityHubScreen", { communityName });
  };

  const getJoinedCommunities = () => {
    return communities.filter((community) =>
      community.communityMembers.some((member) => member.id === userId)
    );
  };

  // Function to determine which action to perform when the modal's confirm button is pressed
  const handleConfirm = () => {
    switch (action) {
      case "create":
        handleCreateCommunity();
        break;
      case "findRadius":
        handleFindCommunityByRadius();
        break;
      case "findName":
        handleSearch();
        break;
      default:
        Alert.alert("Invalid Action", "Unknown action specified.");
    }
  };

  // Function to handle the creation of a new community
  const handleCreateCommunity = async () => {
    try {
      const data = await createCommunity(
        serverIP,
        user.id,
        inputValue,
        user.location
      );
      Alert.alert("Success", "Community created successfully");

      // Update the user's communities with the new data
      const newCommunity = {
        _id: data.id,
        area: inputValue,
        location: user.location,
      };
      updateUserCommunities(newCommunity);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setModalVisible(false);
  };

  // Function to find communities within a certain radius
  const handleFindCommunityByRadius = async () => {
    try {
      const data = await findCommunitiesByRadiusAndLocation(
        serverIP,
        inputValue,
        user.location
      );
      setDisplayedCommunities(data.local_communities);
      setAction("findRadius");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setModalVisible(true);
  };

  // Function to search for communities by name
  const handleSearch = () => {
    if (!inputValue.trim()) {
      Alert.alert("Invalid Input", "Please enter a community name to search.");
      return;
    }

    if (action === "findName" && communities) {
      const searchQuery = inputValue.toLowerCase().trim();

      const filteredCommunities = communities.filter((community) =>
        community.area.toLowerCase().includes(searchQuery)
      );

      if (filteredCommunities.length > 0) {
        setDisplayedCommunities(filteredCommunities);
      } else {
        Alert.alert("No communities found!", "Try another name.");
      }
    }
  };

  // Function to close the modal and reset relevant states
  const handleCloseModal = () => {
    setModalVisible(false);
    setAction(""); // Reset action state
    setDisplayedCommunities([]); // reset the display of the community search buttons
    setInputValue(""); // Reset the input field
  };

  // Main component render
  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder={
                action === "create"
                  ? "Enter Area Name"
                  : action === "findRadius"
                  ? "Enter Radius"
                  : "Enter Community Name"
              }
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>
                {action === "create"
                  ? "Create Community"
                  : action === "findRadius"
                  ? "Find by Radius"
                  : "Search"}
              </Text>
            </TouchableOpacity>
            {/* Conditional rendering of communities list based on search or radius find */}
            {(action === "findName" || action === "findRadius") && (
              <FlatList
                data={displayedCommunities}
                keyExtractor={(item, index) => `community-${index}`}
                renderItem={({ item }) => {
                  const isJoined = user.communities?.includes(item.area);
                  return (
                    <View style={styles.communityContainer}>
                      <Text style={styles.searchCommunityName}>
                        {item.area}
                      </Text>
                      {/* Display join button only if user hasn't already joined */}
                      {isJoined ? (
                        <TouchableOpacity
                          style={styles.joinButtonDisabled}
                          disabled={true}
                        >
                          <Text style={styles.joinButtonText}>Joined</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.joinButton}
                          onPress={() => {
                            const area = item.area;
                            const senderId = user.id;
                            const senderName = user.name;
                            requestToJoinCommunity(
                              serverIP,
                              area,
                              senderId,
                              senderName
                            )
                              .then((response) => {
                                Alert.alert(
                                  "Request Sent",
                                  "Your request to join has been sent."
                                );
                              })
                              .catch((error) => {
                                Alert.alert("Error", error.message);
                              });
                          }}
                        >
                          <Text style={styles.joinButtonText}>
                            Request to Join
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
      {/* Buttons for creating and finding communities */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setAction("create");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Create Community</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setAction("findRadius");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Find Community by Radius</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setAction("findName");
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Find Community by Name</Text>
      </TouchableOpacity>

      {/* Displaying user's communities if its not empty */}
      {getJoinedCommunities().length > 0 ? (
        <>
          <Text style={styles.titleText}>Your Communities:</Text>
          <View style={styles.communityList}>
            {getJoinedCommunities().map((community, index) => (
              <View key={index} style={styles.communityItemContainer}>
                <TouchableOpacity
                  style={styles.communityNameContainer}
                  onPress={() => navigateToCommunity(community.area)}
                >
                  <Text style={styles.communityName}>{community.area}</Text>
                </TouchableOpacity>
                {community.communityManagers.some(
                  (manager) => manager.id === user.id
                ) && (
                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() =>
                      navigation.navigate("CommunityManagerScreen", {
                        communityName: community.area,
                      })
                    }
                  >
                    <Text style={styles.manageButtonText}>Manage</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.titleText}>
          You haven't joined any communities yet.
        </Text>
      )}
    </LinearGradient>
  );
};

// StyleSheet for styling the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: width * 0.95,
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
  input: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "EncodeSansExpanded-Regular",
  },
  communityList: {
    marginTop: 20,
    alignSelf: "flex-start",
    padding: 10,
  },
  searchCommunityName: {
    color: "red",
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Medium",
    flex: 1,
    numberOfLines: 1,
    ellipsizeMode: "tail",
  },
  communityName: {
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4689af",
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-Bold",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 20,
  },
  communityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: width * 0.7,
  },
  communityLocation: {
    color: "#666",
  },
  joinButton: {
    backgroundColor: "#FD844D",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  joinButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "EncodeSansExpanded-Regular",
  },
  communityItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
  communityNameContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  manageButton: {
    backgroundColor: "#FD844D",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 10,
  },
  manageButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "EncodeSansExpanded-Regular",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "lightgrey",
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  joinButtonDisabled: {
    backgroundColor: "grey",
    borderRadius: 5,
    padding: 10,
  },
});

export default CommunityLobby;
