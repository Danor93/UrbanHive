import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Import context hooks for accessing server and user data
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";

// Import API function to fetch community members
import { fetchCommunityMembers } from "../utils/apiUtils";

// Main component for displaying community members
const CommunityMembersScreen = ({ route }) => {
  const { communityName } = route.params; // Destructuring to get community name passed in route parameters
  const { user } = useUser();
  const serverIP = useServerIP();
  const [members, setMembers] = useState([]);
  const [selectedMemberPhoneNumber, setSelectedMemberPhoneNumber] =
    useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect hook to fetch community members from the server
  useEffect(() => {
    fetchCommunityMembers(serverIP, communityName)
      .then((fetchedMembers) => {
        // Filtering out the current user from the members list
        const filteredMembers = fetchedMembers.filter(
          (member) => member.id !== user.id
        );
        setMembers(filteredMembers);
      })
      .catch((error) => console.error(error));
  }, [communityName, serverIP, user.id]);

  // opens the whatsapp with the given phone Number
  const initiateWhatsApp = (phoneNumber) => {
    let url = "whatsapp://send?" + "&phone=972" + phoneNumber;
    Linking.openURL(url)
      .then((data) => {
        console.log("WhatsApp Opened");
      })
      .catch(() => {
        alert("Make sure Whatsapp installed on your device");
      });
  };

  // When the modal is triggered, open WhatsApp with the formatted URL
  const onChatPress = () => {
    initiateWhatsApp(selectedMemberPhoneNumber);
  };

  // Function to render each member in a list
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => {
        setSelectedMemberPhoneNumber(item.phoneNumber); // Set phone number for modal
        setModalVisible(true); // Show modal to initiate chat
      }}
    >
      <Image
        source={require("../assets/images/Empty_Profile.png")}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberAddress}>
          Address: {item.location.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
              <Text style={styles.chatButtonText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// Styles for the component
const styles = {
  container: {
    flex: 1,
  },
  memberContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 50,
    width: "90%",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  memberAddress: {
    fontSize: 14,
    color: "gray",
    fontFamily: "EncodeSansExpanded-Medium",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
    position: "relative",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  chatButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD844D",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "90%",
  },
  chatButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
};

export default CommunityMembersScreen;
