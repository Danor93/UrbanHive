import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
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
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCommunityMembers(serverIP, communityName)
      .then((members) => setMembers(members))
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberContainer}
      onPress={() => setModalVisible(true)}
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
                /* TODO:Implement Whatsapp Navigation */
              }}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
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
