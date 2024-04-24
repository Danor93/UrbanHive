import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
// Importing context hooks for accessing user and server information.
import { useUser } from "../contexts/UserContext";
import { useServerIP } from "../contexts/ServerIPContext";
// Importing utility functions for API calls regarding community interactions.
import {
  fetchCommunityDetails,
  postComment,
  deletePost,
  deleteComment,
} from "../utils/apiUtils";

// Main component definition for displaying and managing a community screen.
const CommunityScreen = ({ navigation, route }) => {
  const { communityName } = route.params;
  const { user } = useUser();
  const serverIP = useServerIP();

  // State hooks to manage community details, comment texts, and refresh control.
  const [communityDetails, setCommunityDetails] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // TODO: grab the members from the server.
  const onlineMembers = [
    { id: "1", name: "Aaron Loeb" },
    { id: "2", name: "Adeline Palmerston" },
    { id: "3", name: "Daniel Gallego" },
    { id: "4", name: "Juliana Silva" },
    { id: "5", name: "Pedro Fernandes" },
  ];

  // Function to fetch community details from the server and manage the state.
  const fetchData = async () => {
    try {
      const data = await fetchCommunityDetails(serverIP, communityName);
      if (data.posts) {
        data.posts.sort(
          (a, b) => new Date(a.post_date) - new Date(b.post_date)
        );
        setCommunityDetails(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to refresh the community data while the user pulls the upper screen down.
  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  // Function to post a comment using API call
  const handlePostComment = async (postId) => {
    if (!commentTexts[postId]) return; // Don't post empty comments

    const commentData = {
      post_id: postId,
      comment_text: commentTexts[postId],
      user_id: user.id,
      user_name: user.name,
    };

    try {
      await postComment(serverIP, commentData);
      console.log("Comment posted successfully");
      setCommentTexts({ ...commentTexts, [postId]: "" }); // Reset comment input field
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Failed to post comment");
    }
  };

  // Function to delete a post using API call.
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(serverIP, postId);
      // Remove the post from the communityDetails state
      setCommunityDetails({
        ...communityDetails,
        posts: communityDetails.posts.filter((post) => post.post_id !== postId),
      });
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post");
    }
  };

  // Function to delete a comment using API call.
  const handleDeleteComment = async (postId, commentId) => {
    const deleteData = {
      post_id: postId,
      comment_id: commentId,
    };

    try {
      await deleteComment(serverIP, deleteData);
      // Update the community details to remove the deleted comment
      setCommunityDetails({
        ...communityDetails,
        posts: communityDetails.posts.map((post) => {
          if (post.post_id === postId) {
            return {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.comment_id !== commentId
              ),
            };
          }
          return post;
        }),
      });
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      Alert.alert("Error", "Failed to delete comment");
    }
  };

  // Function to render each post in the community.
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {item.user_id === user.id && (
        <TouchableOpacity
          onPress={() => handleDeletePost(item.post_id)}
          style={styles.deletePostButton}
        >
          <Ionicons name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      )}
      <Text style={styles.postHeader}>{item.post_content.header}</Text>
      <Text style={styles.postBody}>{item.post_content.body}</Text>
      {item.comments &&
        item.comments.map((comment) => renderComment(comment, item.post_id))}

      <TextInput
        style={styles.commentInput}
        placeholder="Write a comment..."
        onChangeText={(text) =>
          setCommentTexts({ ...commentTexts, [item.post_id]: text })
        }
        value={commentTexts[item.post_id]}
      />
      <TouchableOpacity
        onPress={() => handlePostComment(item.post_id)}
        style={styles.commentButton}
      >
        <Text style={styles.commentButtonText}>Post Comment</Text>
      </TouchableOpacity>
    </View>
  );

  // Function to render each comment in a post.
  const renderComment = (comment, postId) => (
    <View key={comment.comment_id} style={styles.commentContainer}>
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentUserName}>{comment.user_name}:</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
      {comment.user_id === user.id && (
        <TouchableOpacity
          onPress={() => handleDeleteComment(postId, comment.comment_id)}
          style={styles.deleteCommentButton}
        >
          <Ionicons name="close-circle" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Function to render each online member.
  const renderMember = (member) => (
    <View style={styles.memberItem} key={member.id}>
      <Ionicons name="person-circle" size={40} color="white" />
      <Text style={styles.memberName}>{member.name}</Text>
    </View>
  );

  // Main component return structure with layout and styles.
  return (
    <LinearGradient
      colors={["#7168DF", "#4587AF", "#0DB572"]}
      style={styles.container}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hello,{user.name}</Text>
          <Image
            source={require("../assets/images/Empty_Profile.png")}
            style={styles.profilePicture}
          />
        </View>

        <Text style={styles.communityName}>{communityName}</Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="red" />
          <Text style={styles.locationText}>{user.location.address}</Text>
        </View>

        {/* Community Hub Buttons list*/}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityMembersScreen", {
                communityName: communityName,
              });
            }}
            style={styles.button}
          >
            <Ionicons
              name="people"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Show Members</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityCreateEvent", {
                communityName: communityName,
              });
            }}
            style={styles.button}
          >
            <Ionicons
              name="calendar"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityJoinEventScreen", {
                communityName: communityName,
              });
            }}
            style={styles.button}
          >
            <Ionicons
              name="body"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Join Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityPublishPost", {
                communityName: communityName,
              });
            }}
            style={styles.button}
          >
            <Ionicons
              name="clipboard"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Publish Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CommunityNightWatch", {
                communityName: communityName,
              });
            }}
            style={styles.button}
          >
            <Ionicons
              name="moon"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Night Watch</Text>
          </TouchableOpacity>
        </View>

        {/* Online Members List */}
        <Text style={styles.onlineMembersTitle}>Online Members</Text>
        <View style={styles.membersList}>
          {onlineMembers.map(renderMember)}
        </View>

        {/* Post List */}
        <FlatList
          data={communityDetails?.posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.post_id}
          ListFooterComponent={
            <View style={{ paddingVertical: 40 }}>
              {/* Back to Home Page Button */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CommunityLobby");
                }}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Back to the Lobby</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </ScrollView>
    </LinearGradient>
  );
};

// StyleSheet to style various components of the screen.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "EncodeSansExpanded-Bold",
    color: "white",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Light",
    color: "white",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  communityName: {
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-SemiBold",
    color: "white",
    alignSelf: "center",
    marginVertical: 20,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: "50%",
    marginBottom: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  onlineMembersTitle: {
    fontSize: 18,
    fontFamily: "EncodeSansExpanded-SemiBold",
    color: "black",
    marginTop: 20,
  },
  membersList: {
    flexGrow: 0,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  memberName: {
    color: "black",
    fontFamily: "EncodeSansExpanded-Regular",
    marginLeft: 10,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "50%",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  postContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginVertical: 8,
  },
  postHeader: {
    fontSize: 20,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  postBody: {
    fontSize: 16,
    marginVertical: 8,
    fontFamily: "EncodeSansExpanded-Medium",
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // Align items to the start of the flex-direction
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUserName: {
    fontFamily: "EncodeSansExpanded-SemiBold",
    fontSize: 20,
  },
  commentText: {
    fontFamily: "EncodeSansExpanded-Medium",
    fontSize: 16,
  },
  comment: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    fontFamily: "EncodeSansExpanded-Medium",
  },
  commentInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  commentButton: {
    backgroundColor: "#FD844D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  commentButtonText: {
    color: "white",
    fontFamily: "EncodeSansExpanded-SemiBold",
  },
  deletePostButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  deleteCommentButton: {
    padding: 5,
  },
});

export default CommunityScreen;
