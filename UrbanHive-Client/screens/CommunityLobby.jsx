import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";

const CommunityLobby = ({ navigation }) => {
  const { user, updateUserCommunities } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreateCommunity, setIsCreateCommunity] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const serverIP = useServerIP();

  const navigateToCommunity = (communityName) => {
    navigation.navigate("CommunityScreen", { communityName });
  };

  const handleCreateCommunity = async () => {
    try {
      const response = await fetch(`${serverIP}/communities/add_community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager_id: user.id,
          area: inputValue,
          location: user.location,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", "Community created successfully");

        // Update the user's communities
        const newCommunity = {
          _id: data.id, // Use the ID from the response
          area: inputValue, // Use the area name from the input
          location: user.location, // Use the user's location
        };
        console.log("newCommunity:", newCommunity);
        updateUserCommunities(newCommunity);
        // navigation.navigate("CommunityScreen", { communityName: inputValue });
      } else {
        Alert.alert("Error", "Failed to create community");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while creating community");
    }

    setModalVisible(false);
  };

  const handleFindCommunity = () => {
    // TODO:Logic for finding community by radius (No endpoint yet)
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        {/* Modal content here */}
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder={isCreateCommunity ? "Enter Area Name" : "Enter Radius"}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={
              isCreateCommunity ? handleCreateCommunity : handleFindCommunity
            }
          >
            <Text style={styles.buttonText}>
              {isCreateCommunity ? "Create Community" : "Find Community"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsCreateCommunity(true);
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Create Community</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsCreateCommunity(false);
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Find Community by Radius</Text>
      </TouchableOpacity>

      {user && user.communities && user.communities.length > 0 && (
        <>
          <Text style={styles.titleText}>Communities:</Text>
          <View style={styles.communityList}>
            {user.communities.map((community, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToCommunity(community)}
              >
                <Text style={styles.communityName}>{community}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  button: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    marginTop: 15,
    width: "50%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  communityList: {
    marginTop: 20,
    alignSelf: "flex-start",
    padding: 10,
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
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 20,
  },
});

export default CommunityLobby;
