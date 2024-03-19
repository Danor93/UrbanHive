const headers = {
  "Content-Type": "application/json",
};

// Login function
export const loginUser = async (serverIP, ID, password) => {
  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify({ id: ID, password: password }),
  };

  try {
    const response = await fetch(`${serverIP}/users/password`, requestOptions);
    const data = await response.json();

    // Return an object indicating both the status and any relevant data or messages
    return {
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.error(error.message);
    throw new Error("Unable to connect to the server"); // Rethrow with a custom error message
  }
};

// Adjusted function for creating a new account with location data
export const createAccountWithLocation = async (serverIP, accountData) => {
  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(accountData),
  };

  try {
    const response = await fetch(`${serverIP}/user/`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create account.");
    }

    return data; // Return the response data for further processing
  } catch (error) {
    console.error(error);
    throw error; // Rethrow to handle it in the component
  }
};

// Function to fetch user details
export const fetchUserDetails = async (serverIP, userId) => {
  try {
    const response = await fetch(`${serverIP}/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    const userData = await response.json();
    return userData; // Return the fetched user data
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Function to add a friend
export const addFriend = async (serverIP, senderId, receiverId) => {
  try {
    const response = await fetch(`${serverIP}/user/add-friend`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add friend");
    }

    return "Friend added successfully";
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to respond to a friend request
export const respondToFriendRequest = async (
  serverIP,
  receiverId,
  senderId,
  response
) => {
  try {
    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify({
        receiver_id: receiverId,
        sender_id: senderId,
        response: response,
      }),
    };

    const response = await fetch(
      `${serverIP}/user/respond-to-request`,
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json(); // Assuming the server might send back more details on the error
      throw new Error(errorData.message || "Failed to send response");
    }

    // Assuming the API returns a success message or the updated requests list
    const responseData = await response.json();
    return responseData; // You can adjust this return value based on your specific API response structure
  } catch (error) {
    console.error("Error responding to friend request:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to create a community
export const createCommunity = async (serverIP, managerId, area, location) => {
  try {
    const response = await fetch(`${serverIP}/communities/add_community`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        manager_id: managerId,
        area: area,
        location: location,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create community");
    }

    const data = await response.json();
    return data; // Return the response data for further processing
  } catch (error) {
    console.error("Error creating community:", error.message);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to find communities by radius and location
export const findCommunitiesByRadiusAndLocation = async (
  serverIP,
  radius,
  location
) => {
  try {
    const response = await fetch(
      `${serverIP}/communities/get_communities_by_radius_and_location`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          radius: radius,
          location: location,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to find communities");
    }

    const data = await response.json();
    return data; // Return the response data for further processing
  } catch (error) {
    console.error("Error finding communities:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Fetch community members by area
export const fetchCommunityMembers = async (serverIP, communityName) => {
  try {
    const area = encodeURIComponent(communityName);
    const response = await fetch(
      `${serverIP}/communities/details_by_area?area=${area}`,
      {
        method: "POST",
        headers,
      }
    );
    const data = await response.json();
    return data.communityMembers;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array or appropriate error handling
  }
};

// Function to create an event
export const createEvent = async (serverIP, eventDetails) => {
  try {
    const response = await fetch(`${serverIP}/events/add_event`, {
      method: "POST",
      headers,
      body: JSON.stringify(eventDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    const data = await response.json();
    return data; // Return the response data for further processing
  } catch (error) {
    console.error("Error creating event:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to join an event
export const joinEvent = async (serverIP, userId, communityName, eventName) => {
  try {
    const requestBody = {
      user_id: userId,
      community_name: communityName,
      event_name: eventName,
      response: true, // Assuming this is a boolean indicating the desire to join
    };

    const response = await fetch(
      `${serverIP}/events/respond_to_event_request`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Assuming the server might send back more details on the error
      throw new Error(errorData.message || `Failed to join event ${eventName}`);
    }

    // Assuming the API returns success information
    const data = await response.json();
    return data; // Return the response data for further processing
  } catch (error) {
    console.error(`Error joining event ${eventName}:`, error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to publish a post
export const publishPost = async (
  serverIP,
  userId,
  communityName,
  header,
  body
) => {
  const postDate = new Date().toISOString();
  const postData = {
    user_id: userId,
    community_area: communityName,
    post_content: { header, body },
    post_date: postDate,
  };

  try {
    const response = await fetch(`${serverIP}/posting/add_post`, {
      method: "POST",
      headers,
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Assuming the server might send back more details on the error
      throw new Error(errorData.message || "Server responded with an error!");
    }

    const jsonResponse = await response.json();
    return jsonResponse; // Handle the response as needed, possibly returning some value
  } catch (error) {
    console.error("Error publishing post:", error);
    throw error; // Rethrow to allow the caller to handle it
  }
};

// Function to fetch community details
export const fetchCommunityDetails = async (serverIP, communityName) => {
  const area = encodeURIComponent(communityName);
  try {
    const response = await fetch(
      `${serverIP}/communities/details_by_area?area=${area}`,
      {
        method: "POST",
        headers,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch community details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
};

// Function to post a comment
export const postComment = async (serverIP, commentData) => {
  try {
    const response = await fetch(`${serverIP}/posting/add_comment_to_post`, {
      method: "POST",
      headers,
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      throw new Error("Failed to post comment");
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

// Function to delete a post
export const deletePost = async (serverIP, postId) => {
  try {
    const response = await fetch(`${serverIP}/posting/delete_post`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ post_id: postId }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Function to delete a comment
export const deleteComment = async (serverIP, deleteData) => {
  try {
    const response = await fetch(
      `${serverIP}/posting/delete_comment_from_post`,
      {
        method: "DELETE",
        headers,
        body: JSON.stringify(deleteData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
