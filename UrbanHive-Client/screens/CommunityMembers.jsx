import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import { fetchCommunityMembers } from "../utils/apiUtils";

const CommunityMembersScreen = ({ route }) => {
  const { communityName } = route.params;
  const { user } = useUser();
  const serverIP = useServerIP();
  const [members, setMembers] = useState([]);
  const [selectedMemberPhoneNumber, setSelectedMemberPhoneNumber] =
    useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCommunityMembers(serverIP, communityName)
      .then((fetchedMembers) => {
        // Filter out the current user from the list of members
        const filteredMembers = fetchedMembers.filter(
          (member) => member.id !== user.id
        );
        setMembers(filteredMembers);
      })
      .catch((error) => console.error(error));
  }, [communityName, serverIP, user.id]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => {
        setSelectedMemberPhoneNumber(item.phoneNumber);
        setModalVisible(true);
      }}
    >
      <Image
        source={require("../assets/images/Empty_Profile.png")}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberAddress}>{item.location.address}</Text>
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

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => {
                const phoneNumberWithPrefix = `+972${selectedMemberPhoneNumber.replace(
                  /^0+/,
                  ""
                )}`;
                const whatsappUrl = `whatsapp://send?phone=${phoneNumberWithPrefix}`;

                Linking.canOpenURL(whatsappUrl)
                  .then((supported) => {
                    if (!supported) {
                      Alert.alert("WhatsApp is not installed");
                    } else {
                      return Linking.openURL(whatsappUrl);
                    }
                  })
                  .catch((err) => console.error("An error occurred", err));
              }}
            >
              <Text style={styles.chatButtonText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

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
    backgroundColor: "#FD844D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
};

export default CommunityMembersScreen;
