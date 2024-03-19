import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";
import { createEvent } from "../utils/apiUtils";

const CommunityCreateEvent = ({ navigation, route }) => {
  const { user } = useUser();
  const serverIP = useServerIP();
  const { communityName } = route.params;

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [guestList, setGuestList] = useState([""]); // Start with one empty input

  const handleCreateEvent = async () => {
    const filteredGuestList = guestList.filter(
      (guestId) => guestId.trim() !== ""
    );
    const eventDetails = {
      initiator: user.id,
      community_name: communityName,
      location: user.location,
      event_name: eventName,
      event_type: eventType,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      guest_list: filteredGuestList,
    };

    try {
      const data = await createEvent(serverIP, eventDetails);
      Alert.alert("Success", "Event created successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while creating event");
    }
  };

  const handleGuestChange = (text, index) => {
    const newGuestList = [...guestList];
    newGuestList[index] = text;
    setGuestList(newGuestList);
  };

  const addGuestInput = () => {
    setGuestList([...guestList, ""]); // Add another empty input
  };

  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventName}
            value={eventName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Type:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventType}
            value={eventType}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Time:</Text>
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={startTime}
              onDateChange={setStartTime}
              mode="datetime"
              theme="light"
              textColor="black"
              androidVariant="iosClone"
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Time:</Text>
          <View style={styles.datePickerContainer}>
            <DatePicker
              date={endTime}
              onDateChange={setEndTime}
              mode="datetime"
              textColor="black"
              androidVariant="iosClone"
            />
          </View>
        </View>

        <View style={styles.guestListHeader}>
          <Text style={styles.guestListLabel}>Guest List:</Text>
          <TouchableOpacity onPress={addGuestInput} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.addGuestText}>Add Guest</Text>
          </TouchableOpacity>
        </View>

        {guestList.map((guestId, index) => (
          <View key={index} style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleGuestChange(text, index)}
              value={guestId}
              placeholder="Guest ID"
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.createEventButton}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createEventButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
    paddingBottom: 200,
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderRadius: 15,
  },
  guestListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    marginTop: 15,
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  guestListLabel: {
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
  },
  createEventButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 40,
  },
  createEventButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-SemiBold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addGuestText: {
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-SemiBold",
  },
});

export default CommunityCreateEvent;
