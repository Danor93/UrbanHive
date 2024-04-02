import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";
import { publishPost } from "../utils/apiUtils";

const CommunityPublishPost = ({ navigation, route }) => {
  const { communityName } = route.params;
  const { user } = useUser();
  const serverIP = useServerIP();
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");

  const publishPostHandler = async () => {
    try {
      await publishPost(serverIP, user.id, communityName, header, body);
      Alert.alert("Success", "Post published successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to publish post!");
    }
  };

  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={setHeader}
          value={header}
          placeholder="Enter post title"
        />
        <Text style={styles.label}>Body</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          onChangeText={setBody}
          value={body}
          placeholder="Enter post body"
          multiline={true}
        />
      </View>

      <TouchableOpacity
        style={styles.publishButton}
        onPress={publishPostHandler}
      >
        <Text style={styles.publishButtonText}>Publish Post</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginVertical: 20,
    marginTop: 40,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontFamily: "EncodeSansExpanded-Bold",
    textDecorationLine: "underline",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  textArea: {
    height: 300,
    textAlignVertical: "top",
  },
  publishButton: {
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
  publishButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "EncodeSansExpanded-Bold",
  },
};

export default CommunityPublishPost;
