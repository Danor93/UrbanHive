import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Importing context hooks for user data and server configuration.
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";

// API utility imports for event handling.
import { joinEvent, fetchAllEvents } from "../utils/apiUtils";

// Component for users to join events within their community.
const CommunityJoinEventScreen = ({ route }) => {
  // State for storing list of events.
  const { communityName } = route.params; // Destructuring to get community name passed in route parameters
  const [events, setEvents] = useState([]);

  // Context hooks to access user data and server IP.
  const { user } = useUser();
  const serverIP = useServerIP();

  useEffect(() => {
    const fetchAndFilterEvents = async () => {
      try {
        const allEvents = await fetchAllEvents(serverIP); // Call the utility function to fetch events

        const filteredEvents = allEvents.filter(
          (event) => event.community_name === communityName
        );
        setEvents(filteredEvents); // Set the filtered events to state
      } catch (error) {
        console.error("Failed to fetch events:", error);
        Alert.alert("Error", "Failed to fetch events. Please try again later."); // Show an alert for the error
      }
    };

    fetchAndFilterEvents(); // Call the fetch function in useEffect
  }, [serverIP, communityName]); // Re-run if serverIP or communityName changes

  // Function to handle joining an event.
  const handleJoinEvent = async (eventItem) => {
    try {
      // API call to join the event.
      await joinEvent(
        serverIP,
        user.id,
        eventItem.community_name,
        eventItem.event_name
      );
      console.log(`Joined event ${eventItem.event_name} successfully`);
    } catch (error) {
      console.error(`Failed to join event ${eventItem.event_name}:`, error);
      Alert.alert(
        "Error",
        `An error occurred while joining event ${eventItem.event_name}`
      );
    }
  };

  // Function to format ISO date strings to local date and time format.
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Component rendering a list of joinable community events.
  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <FlatList
        data={events}
        keyExtractor={(item) =>
          item._id && item._id.$oid ? item._id.$oid : item.event_name
        }
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventName}>{item.event_name}</Text>
              <Text
                style={styles.eventDetails}
              >{`Type: ${item.event_type}`}</Text>
              <Text style={styles.eventDetails}>{`Start: ${formatDateTime(
                item.start_time
              )}`}</Text>
              <Text style={styles.eventDetails}>{`End: ${formatDateTime(
                item.end_time
              )}`}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleJoinEvent(item)}
              style={styles.joinButton}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
};

// Styling for the component using StyleSheet.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 50,
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  eventName: {
    fontFamily: "EncodeSansExpanded-Bold",
    fontSize: 16,
  },
  eventDetails: {
    fontSize: 14,
    fontFamily: "EncodeSansExpanded-Medium",
  },
  joinButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FD844D",
    borderRadius: 5,
  },
  joinButtonText: {
    color: "white",
  },
});

export default CommunityJoinEventScreen;
