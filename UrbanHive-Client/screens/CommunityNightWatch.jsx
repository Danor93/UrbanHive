import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useServerIP } from "../contexts/ServerIPContext";
import { useUser } from "../contexts/UserContext";
import {
  fetchNightWatchesByCommunity,
  joinNightWatch,
} from "../utils/apiUtils";

const CommunityNightWatch = ({ navigation, route }) => {
  const { communityName } = route.params;
  const serverIP = useServerIP();
  const { user } = useUser();
  const [nightWatches, setNightWatches] = useState([]);
  const [joinedWatches, setJoinedWatches] = useState([]);

  useEffect(() => {
    const fetchNightWatches = async () => {
      try {
        const response = await fetchNightWatchesByCommunity(
          serverIP,
          communityName
        );
        if (response) {
          setNightWatches(response.night_watches);
        }
      } catch (error) {
        console.error("Failed to fetch night watches:", error);
      }
    };

    fetchNightWatches();
  }, [route.params?.community_name, serverIP]);

  const handleJoin = async (nightWatchId) => {
    const { success, message, error } = await joinNightWatch(
      serverIP,
      user.id,
      nightWatchId
    );
    if (success) {
      Alert.alert("Success", message);
      // Manually update the nightWatches state to reflect the join without refetching
      const updatedNightWatches = nightWatches.map((watch) => {
        if (watch.watch_id === nightWatchId) {
          // Assuming watch_members is an array of user IDs. Adjust as needed.
          const updatedWatchMembers = [...watch.watch_members, { id: user.id }]; // Add current user as a member
          return { ...watch, watch_members: updatedWatchMembers };
        }
        return watch;
      });

      setNightWatches(updatedNightWatches);
      setJoinedWatches((prev) => [...prev, nightWatchId]); // Mark as joined
    } else {
      Alert.alert("Error", error);
    }
  };

  const renderItem = ({ item }) => {
    // Check if the user has already joined this night watch
    const hasJoined = user.night_watches.some(
      (watch) => watch.watch_id === item.watch_id
    );
    // Calculate the number of already registered members
    const registeredMembersCount = item.watch_members.length;
    // Construct the display string for positions
    const positionsDisplay = `${registeredMembersCount} / ${item.positions_amount}`;

    return (
      <View style={styles.watchContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailsText}>
            Initiator: {item.initiator_name}
          </Text>
          <Text style={styles.detailsText}>Date: {item.watch_date}</Text>
          <Text style={styles.detailsText}>Positions: {positionsDisplay}</Text>
        </View>
        {!hasJoined &&
        !item.watch_members.map((member) => member.id).includes(user.id) ? (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoin(item.watch_id)}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.joinedButton}>
            <Text style={styles.joinButtonText}>Joined</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <Text style={styles.title}>Night Watches:</Text>
      {nightWatches ? (
        <FlatList
          data={nightWatches}
          renderItem={renderItem}
          keyExtractor={(item) => item.watch_id}
        />
      ) : (
        <View style={styles.centerMessage}>
          <Text style={styles.centerMessageText}>No night watch yet</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  watchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  detailsText: {
    fontFamily: "EncodeSansExpanded-Regular",
    fontSize: 16,
  },
  joinButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#FD844D",
    borderRadius: 10,
  },
  joinedButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  joinButtonText: {
    color: "white",
    fontFamily: "EncodeSansExpanded-Bold",
  },
  title: {
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-Bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
    textDecorationLine: "underline",
  },
  centerMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerMessageText: {
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-ExtraBold",
  },
});

export default CommunityNightWatch;
