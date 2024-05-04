/**
 * log in a user using the given credentials and server IP address.
 * It sends a POST request to the server's login endpoint.
 *
 * @param {string} serverIP - The IP address of the server.
 * @param {string} ID - The user ID.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the status and data or error message.
 */
export const loginUser = async (serverIP, ID, password) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: ID, password: password }),
  };

  try {
    const response = await fetch(`${serverIP}/users/password`, requestOptions);
    const data = await response.json();

    // Handling based on status code
    switch (response.status) {
      case 200:
        // Successful login
        return { status: "success", data: data };
      case 400:
        // Bad Request - Missing ID or Password
        alert("ID and password are required.");
        break;
      case 401:
        // Unauthorized - Incorrect password
        alert("Incorrect password.");
        break;
      case 404:
        // Not Found - User does not exist
        alert("User not found.");
        break;
      default:
        // Handle unexpected status codes
        alert("An unexpected error occurred.");
    }
  } catch (error) {
    console.error(error.message);
    alert("Unable to connect to the server"); // Show alert with a custom error message
  }

  // Returning a generic error status if an alert is shown for an error condition
  return {
    status: "error",
    message:
      "An error occurred during login. Please check the console for more details.",
  };
};

/**
 * Creates a user account with additional location data.
 * Sends a POST request to the server's user creation endpoint.
 *
 * @param {string} serverIP - The IP address of the server.
 * @param {Object} accountData - The account data including location details.
 * @returns {Promise<Object|undefined>} - A promise resolving to the response data from the server or undefined if an error occurs.
 */
export const createAccountWithLocation = async (serverIP, accountData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  };

  try {
    const response = await fetch(`${serverIP}/user/`, requestOptions);
    const data = await response.json();

    // Handling different response statuses explicitly
    switch (response.status) {
      case 201:
        // User added successfully
        return data; // Return the response data for further processing
      case 400:
        // Bad request, such as missing fields or invalid data types
        alert(
          data.description ||
            "There was a problem with the information provided."
        );
        break;
      case 409:
        // Conflict, such as user with ID or email already exists
        alert(
          data.message ||
            "An account with the provided ID or email already exists."
        );
        break;
      default:
        // Handle other unexpected statuses
        throw new Error(data.message || "Failed to create account.");
    }
  } catch (error) {
    console.error(error.message);
    alert(
      "An error occurred while trying to create the account. Please try again."
    );
    throw error; // Rethrow to handle it in the component
  }
};

/**
 * Fetches user details from the server using the user's ID.
 *
 * @param {string} serverIP - The IP address of the server.
 * @param {string} userId - The ID of the user whose details are to be fetched.
 * @returns {Promise<Object>} - A promise that resolves with the user's details if successful.
 */
export const fetchUserDetails = async (serverIP, userId) => {
  try {
    const response = await fetch(`${serverIP}/user/${userId}`);

    // Check if the response status explicitly indicates that the user was not found
    if (response.status === 404) {
      alert("User not found.");
      throw new Error("User not found"); // Throw to exit the function after alerting
    }

    if (!response.ok) {
      // For any other non-ok response, provide a generic failure message
      alert("Failed to fetch user details. Please try again.");
      throw new Error("Failed to fetch user details"); // Throw to exit the function after alerting
    }

    const userData = await response.json();
    return userData; // Return the fetched user data only if successful
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error; // Rethrow to handle it in the component, this allows for additional handling/logging if necessary
  }
};

/**
 * Adds a friend to the user's friend list by making a server request.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} senderId - The ID of the user who is sending the friend request.
 * @param {string} receiverId - The ID of the user who is receiving the friend request.
 * @returns {Promise<string>} - A promise that resolves with a success message if the friend is added successfully.
 */
export const addFriend = async (serverIP, senderId, receiverId) => {
  try {
    const response = await fetch(`${serverIP}/user/add-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || "Failed to add friend";

      // Alerting the user based on the specific error
      alert(errorMessage);
      throw new Error(errorMessage); // Throwing an error after alerting to stop execution
    }

    return "Friend added successfully";
  } catch (error) {
    console.error("Error adding friend:", error);
    alert("An error occurred while trying to add a friend. Please try again.");
    throw error; // Rethrowing to allow the caller to handle it
  }
};

/**
 * Handles the response to a friend request by sending the user's decision to the server.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} receiverId - The ID of the user who received the friend request.
 * @param {string} senderId - The ID of the user who sent the friend request.
 * @param {number} response - The response to the request (1 for accept, 0 for decline).
 * @returns {Promise<Response>} - A promise that resolves with the server's response object.
 */
export const respondToFriendRequest = async (
  serverIP,
  receiverId,
  senderId,
  response
) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver_id: receiverId,
        sender_id: senderId,
        response: response,
      }),
    };

    const fetchResponse = await fetch(
      `${serverIP}/user/respond-to-request`,
      requestOptions
    );

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      alert(errorData.error || "Failed to send response");
      throw new Error(errorData.error || "Failed to send response");
    }

    // const responseData = await fetchResponse.json();
    return fetchResponse;
  } catch (error) {
    console.error("Error responding to friend request:", error);
    alert(
      "An error occurred while trying to respond to the friend request. Please try again."
    ); // Error alert for catch block
    throw error; // Rethrow to allow the caller to handle it, if additional handling is required
  }
};

/**
 * Fetches all community data from the server.
 *
 * @param {string} serverIP - The server IP address.
 * @returns {Promise<Array>} - A promise that resolves with an array of community data.
 */
export const fetchAllCommunities = async (serverIP) => {
  try {
    const response = await fetch(`${serverIP}/communities/get_all`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    alert("Failed to fetch communities. Please try again later."); // Notify users of the failure
    throw error; // Re-throwing the error to be handled by the calling component
  }
};

/**
 * Creates a community by submitting community details to the server.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} managerId - The ID of the community manager.
 * @param {string} area - The geographical area of the community.
 * @param {string} location - The specific location details of the community.
 * @returns {Promise<Object>} - A promise that resolves with the server response data.
 */
export const createCommunity = async (serverIP, managerId, area, location) => {
  try {
    const response = await fetch(`${serverIP}/communities/add_community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manager_id: managerId,
        area: area,
        location: location,
      }),
    });

    const data = await response.json(); // Parse JSON body irrespective of response.ok for error details

    if (response.ok) {
      alert("Community created successfully!"); // Notify the user about the success
      return data; // Return the response data for further processing
    } else {
      // Handle specific status codes with custom messages
      let errorMessage = "Failed to create community"; // Default message
      if (response.status === 400) {
        errorMessage =
          data.error || "Invalid request or community already exists.";
      } else if (response.status === 404) {
        errorMessage = "Manager not found.";
      } else if (response.status === 500) {
        errorMessage = "Server error, please try again later.";
      }
      alert(errorMessage); // Display specific error message to the user
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error creating community:", error);
    alert(
      "An unexpected error occurred while creating the community. Please check the console for more details."
    ); // Fallback error notification
    throw error; // Rethrow to allow the caller to handle it
  }
};

/**
 * Searches for communities within a specified radius and location.
 *
 * @param {string} serverIP - The server IP address.
 * @param {number} radius - The radius within which to search for communities.
 * @param {string} location - The central location from which the radius is measured.
 * @returns {Promise<Object>} - A promise that resolves with the found communities or an error message.
 */
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          radius: radius,
          location: location,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // Handling specific status code
      let errorMessage = "Failed to find communities";
      if (response.status === 500) {
        errorMessage =
          errorData.error ||
          "A database error occurred, please try again later.";
      }
      // Alert the user with the specific error message
      alert(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // Return the response data for further processing
  } catch (error) {
    console.error("Error finding communities:", error);
    // Optionally alert the user about this catch block error
    alert(
      "An unexpected error occurred while searching for communities. Please check the console for more details."
    );
    throw error; // Rethrow to allow the caller to handle it
  }
};

/**
 * Fetches the members of a community based on the community name.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} communityName - The name of the community to fetch members from.
 * @returns {Promise<Array>} - A promise that resolves with a list of community members.
 */
export const fetchCommunityMembers = async (serverIP, communityName) => {
  try {
    const area = encodeURIComponent(communityName);
    const response = await fetch(
      `${serverIP}/communities/details_by_area?area=${area}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Parse error details
      // Specific error handling based on status codes
      switch (response.status) {
        case 400:
          alert("Area name is required.");
          break;
        case 404:
          alert("Community not found.");
          break;
        default:
          alert("An unexpected error occurred.");
      }
      return []; // Return an empty array on error
    }

    const data = await response.json();
    return data.communityMembers;
  } catch (error) {
    console.error("Error fetching community members:", error);
    alert("Failed to fetch community members due to a network error.");
    return []; // Return an empty array or appropriate error handling
  }
};

/**
 * Fetches all events from the server.
 *
 * @param {string} serverIP - The server IP address.
 * @returns {Promise<Array>} - A promise that resolves with a list of events.
 */
export const fetchAllEvents = async (serverIP) => {
  try {
    const response = await fetch(`${serverIP}/events/get_all_events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check for HTTP status codes that indicate errors
    if (!response.ok) {
      const errorMessage = `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage); // Throw error with the status and message
    }

    const events = await response.json(); // Parse JSON response
    return events; // Return the list of events
  } catch (error) {
    console.error("Failed to fetch all events:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

/**
 * Creates an event within a community on the server.
 *
 * @param {string} serverIP - The server IP address.
 * @param {Object} eventDetails - The details of the event to be created.
 * @returns {Promise<Object>} - A promise that resolves with the creation response from the server.
 */
export const createEvent = async (serverIP, eventDetails) => {
  try {
    const response = await fetch(`${serverIP}/events/add_event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventDetails),
    });

    const data = await response.json(); // Decode JSON first to access potential error messages

    if (!response.ok) {
      // Check for a 400 Bad Request status code explicitly
      if (response.status === 400) {
        alert(
          data.error ||
            "There was a problem with the event creation request. Please check the details and try again."
        );
      } else {
        // For all other errors, use a more generic message
        alert(
          data.message || "Failed to create event due to an unexpected error."
        );
      }
      throw new Error(data.message || "Failed to create event");
    }

    // Assuming the event creation is successful
    alert("Event created successfully and invitations sent!");
    return data; // Return the successful response data for further processing
  } catch (error) {
    console.error("Error creating event:", error);
    throw error; // Rethrow to allow the caller to handle it further if needed
  }
};

/**
 * Allows a user to join an event by sending a request to the server.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} userId - The ID of the user who wants to join the event.
 * @param {string} communityName - The name of the community where the event is held.
 * @param {string} eventID - The ID of the event to join.
 * @param {string} eventName - The name of the event to join.
 * @returns {Promise<Object>} - A promise that resolves with the server's response to the join request.
 */
export const joinEvent = async (
  serverIP,
  userId,
  communityName,
  eventID,
  eventName
) => {
  try {
    const requestBody = {
      user_id: userId,
      community_name: communityName,
      event_id: eventID,
      // response: true, // Indicating the desire to join
    };

    const response = await fetch(`${serverIP}/events/request_to_join_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Decode JSON body for error details
      // Handling specific status code
      let errorMessage = `Failed to join event ${eventName}`;
      if (response.status === 404) {
        if (errorData.error.includes("User not found")) {
          errorMessage = "User not found.";
        } else if (errorData.error.includes("Event request not found")) {
          errorMessage = "Event request not found.";
        }
      }
      alert(errorMessage); // Display specific error message to the user
      throw new Error(errorMessage);
    }

    // If the operation is successful
    const data = await response.json();
    alert("Successfully joined the event!"); // Notify the user of success
    return data; // Return the successful response data for further processing
  } catch (error) {
    console.error(`Error joining event ${eventName}:`, error);
    alert(
      "An unexpected error occurred while attempting to join the event. Please try again."
    ); // General catch-all error notification
    throw error; // Rethrow to allow further handling
  }
};

/**
 * Deletes an event based on its ID.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} eventId - The unique identifier of the event to be deleted.
 * @returns {Promise<string>} - A promise that resolves with a success message confirming the deletion.
 */
export const deleteEvent = async (serverIP, eventId) => {
  try {
    const response = await fetch(`${serverIP}/events/delete_event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id: eventId }),
    });

    // Check if the response indicates success
    if (response.status === 200) {
      const data = await response.json(); // Parse response JSON
      return data.message; // Return success message
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error deleting event:", error.message || error);
    throw new Error(error.message || "Failed to delete event");
  }
};

/**
 * Publishes a post to a community, including headers and body content.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} userId - The ID of the user posting the content.
 * @param {string} communityName - The name of the community where the post is made.
 * @param {string} header - The title or header of the post.
 * @param {string} body - The main content of the post.
 * @returns {Promise<Object>} - A promise that resolves with the response data from the server, including any server-side messages or errors.
 */
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const errorData = await response.json();

    if (!response.ok) {
      // Construct a specific error message based on the status code
      let errorMessage = "Server responded with an error!";
      switch (response.status) {
        case 400:
          errorMessage = errorData.error || "Missing required fields.";
          break;
        case 404:
          errorMessage =
            errorData.error ||
            "User is not a member of the community or user not found.";
          break;
        case 409:
          errorMessage =
            errorData.error || "A post with similar data already exists.";
          break;
        case 500:
          errorMessage = errorData.error || "A server error occurred.";
          break;
        default:
          // Leave the default error message if none of the above cases match
          break;
      }

      alert(errorMessage); // Alert the user with the specific error message
      throw new Error(errorMessage);
    }

    alert("Post added successfully!"); // Notify the user of success
    return errorData; // Return the successful response data for further processing
  } catch (error) {
    console.error("Error publishing post:", error);
    alert(
      "An unexpected error occurred while attempting to publish the post. Please try again."
    ); // General error notification for catch block
    throw error; // Rethrow to allow further handling
  }
};

/**
 * Fetches detailed information about a specific community based on its name.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} communityName - The name of the community for which details are required.
 * @returns {Promise<Object>} - A promise that resolves with detailed community data or an error message.
 */
export const fetchCommunityDetails = async (serverIP, communityName) => {
  const area = encodeURIComponent(communityName);
  try {
    const response = await fetch(
      `${serverIP}/communities/details_by_area?area=${area}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const errorData = await response.json(); // Decode response to access potential error messages

    if (!response.ok) {
      // Handle specific HTTP status codes with custom messages
      let errorMessage = "Failed to fetch community details";
      if (response.status === 400) {
        errorMessage = errorData.error || "Area name is required.";
      } else if (response.status === 404) {
        errorMessage = errorData.error || "Community not found.";
      }
      alert(errorMessage); // Use alert to provide immediate feedback to the user
      throw new Error(errorMessage);
    }

    return errorData; // Return the successful response data
  } catch (error) {
    console.error("Error fetching community details:", error);
    alert(
      "An unexpected error occurred while fetching community details. Please try again."
    ); // Fallback for other errors
    throw error; // Rethrow to enable further handling
  }
};

/**
 * Posts a comment to a specific post within a community.
 *
 * @param {string} serverIP - The server IP address.
 * @param {Object} commentData - The data for the comment including the post identifier and the comment text.
 * @returns {Promise<Object>} - A promise that resolves with the response from the server, including the status of the comment addition.
 */
export const postComment = async (serverIP, commentData) => {
  try {
    const response = await fetch(`${serverIP}/posting/add_comment_to_post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json(); // Parse JSON irrespective of response.ok to access the body

    if (!response.ok) {
      // Handle specific HTTP status codes with custom messages
      let errorMessage = "Failed to post comment";
      switch (response.status) {
        case 400:
          errorMessage = data.error || "Missing required fields.";
          break;
        case 404:
          errorMessage = data.error || "Post not found in postings.";
          break;
        default:
          // Use the server-provided message or a generic error
          errorMessage = data.message || "An unexpected error occurred.";
          break;
      }
      alert(errorMessage); // Display the error to the user
      throw new Error(errorMessage);
    } else if (response.status === 200) {
      alert(
        data.warning ||
          "Comment added, but the post was not found in any community."
      );
      return data;
    }

    alert("Comment added successfully!"); // Notify the user of success
    return data;
  } catch (error) {
    console.error("Error posting comment:", error);
    alert(
      "An unexpected error occurred while trying to post the comment. Please try again."
    );
    throw error; // Rethrow for further handling
  }
};

/**
 * Deletes a post by its unique identifier.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} postId - The unique identifier of the post to be deleted.
 * @returns {Promise<string>} - A promise that resolves with a success message if the deletion is successful.
 */
export const deletePost = async (serverIP, postId) => {
  try {
    const response = await fetch(`${serverIP}/posting/delete_post`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: postId }),
    });

    // Ensure to parse the response to get the error message or success confirmation
    const data = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes with customized messages
      let errorMessage = "Failed to delete post";
      if (response.status === 400) {
        errorMessage = data.error || "Missing required field: post_id.";
      } else if (response.status === 404) {
        errorMessage = data.error || "Post not found or already deleted.";
      }
      alert(errorMessage); // Display the error message to the user
      throw new Error(errorMessage);
    } else {
      // Handle success messages
      let successMessage = data.message || "Post deleted successfully.";
      alert(successMessage); // Notify the user of successful deletion
      return data;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert(
      "An unexpected error occurred while trying to delete the post. Please try again."
    ); // General catch-all for any other errors
    throw error; // Rethrow to allow further handling
  }
};

/**
 * Deletes a comment from a post by its unique identifier.
 *
 * @param {string} serverIP - The server IP address.
 * @param {Object} deleteData - The necessary data to identify the comment to be deleted.
 * @returns {Promise<string>} - A promise that resolves with a success message if the deletion is successful.
 */
export const deleteComment = async (serverIP, deleteData) => {
  try {
    const response = await fetch(
      `${serverIP}/posting/delete_comment_from_post`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteData),
      }
    );

    // Parse the JSON response to access the server's return message or error
    const data = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes with customized messages
      let errorMessage = "Failed to delete comment";
      if (response.status === 400) {
        errorMessage = data.error || "Missing post_id or comment_id.";
      } else if (response.status === 404) {
        errorMessage =
          data.error || "Post or comment not found or already deleted.";
      }
      alert(errorMessage); // Display the error message to the user
      throw new Error(errorMessage);
    }

    // Handle various success scenarios signaled by the 200 OK status
    let successMessage =
      data.message || data.warning || "Comment deleted successfully";
    alert(successMessage); // Notify the user of success
    return data; // Return the successful response data for further processing
  } catch (error) {
    console.error("Error deleting comment:", error);
    alert(
      "An unexpected error occurred while trying to delete the comment. Please try again."
    ); // General catch-all for any other errors
    throw error; // Rethrow for further handling
  }
};

/**
 * Sends a request to join a community.
 *
 * @param {string} serverIP The server IP address including the port number.
 * @param {string} area The area name of the community to join.
 * @param {string} senderId The ID of the user sending the join request.
 * @param {string} senderName The name of the user sending the join request.
 * @returns {Promise} A promise that resolves with the response of the join request.
 */
export const requestToJoinCommunity = async (
  serverIP,
  area,
  senderId,
  senderName
) => {
  try {
    const response = await fetch(`${serverIP}/communities/request_to_join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        area: area,
        sender_id: senderId,
        sender_name: senderName,
      }),
    });

    const data = await response.json(); // Parse JSON irrespective of response.ok to access the body

    if (!response.ok) {
      // Handle specific HTTP status codes with customized messages
      let errorMessage = "Failed to send join request";
      if (response.status === 404) {
        errorMessage =
          data.error || "Invalid sender ID or community does not exist.";
      }
      alert(errorMessage); // Display the error message to the user
      throw new Error(errorMessage);
    }

    alert(data.message || "Join request sent successfully!"); // Notify the user of success
    return data; // Return the successful response data for further processing
  } catch (error) {
    console.error("Failed to send join request:", error);
    alert(
      "An unexpected error occurred while trying to send the join request. Please try again."
    ); // General catch-all for any other errors
    throw error; // Rethrow for further handling
  }
};

/**
 * Respond to a join request for a community.
 *
 * @param {string} serverIP The IP address of the server, including the port.
 * @param {string} requestId The ID of the join request.
 * @param {number} response The response to the join request (1 for accept, 0 for decline).
 * @returns {Promise} A promise that resolves with the API call's response.
 */
export const respondToJoinCommunityRequest = async (
  serverIP,
  requestId,
  accept
) => {
  try {
    const url = `${serverIP}/communities/respond_to_join_request`;
    const body = JSON.stringify({
      request_id: requestId,
      response: accept, // Assumed to be a boolean where true represents acceptance
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    };

    const fetchResponse = await fetch(url, requestOptions);
    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      let errorMessage = "Failed to respond to join request";
      if (fetchResponse.status === 404) {
        errorMessage =
          errorData.error || "Invalid request ID or sender user not found.";
      }
      console.error(errorMessage);
      alert(errorMessage); // Provide feedback about the error
      throw new Error(errorMessage);
    }

    const data = await fetchResponse.json();
    alert("Response processed successfully"); // Notify of successful operation
    return data;
  } catch (error) {
    console.error("Failed to respond to join request:", error);
    alert(
      "An unexpected error occurred while trying to respond to the join request. Please try again."
    ); // General error feedback
    throw error; // Allow further handling by re-throwing the error
  }
};

/**
 * Fetches information about night watches scheduled in a specific community.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} communityName - The name of the community for which night watches are sought.
 * @returns {Promise<Object>} - A promise that resolves with details of night watches or an error message.
 */
export const fetchNightWatchesByCommunity = async (serverIP, communityName) => {
  try {
    const response = await fetch(`${serverIP}/night_watch/by_community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ community_name: communityName }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Check for the specific message indicating no future night watches
      if (
        data.message &&
        data.message.includes(
          "No future night watches found for this community"
        )
      ) {
        alert("No Future Night Watches");
        return data;
      }
      return data;
    } else {
      // Handle non-200 responses with specific messages
      let alertMessage = "Something went wrong. Please try again.";
      switch (response.status) {
        case 400:
          alertMessage =
            "Missing 'community_name' in request. Please provide a community name.";
          break;
        case 404:
          alertMessage =
            "Community not found. Please check the community name and try again.";
          break;
        default:
          alertMessage =
            data.error || "An error occurred. Please try again later.";
      }

      alert(alertMessage);
      throw new Error(alertMessage); // Throw an error to stop the execution and log it
    }
  } catch (error) {
    // If fetching fails due to network issues or JSON parsing fails
    console.error("Error fetching night watches:", error.message);
    alert(
      "Unable to connect to the server. Please check your internet connection and try again."
    );
    throw error; // Re-throw the error to be handled by the calling function
  }
};

/**
 * Registers a user as a participant in a specified night watch.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} candidateId - The user ID of the participant.
 * @param {string} nightWatchId - The ID of the night watch to join.
 * @returns {Promise<Object>} - A promise that resolves with the participation status or an error message.
 */
export const joinNightWatch = async (serverIP, candidateId, nightWatchId) => {
  try {
    const response = await fetch(`${serverIP}/night_watch/join_watch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        night_watch_id: nightWatchId,
      }),
    });

    const data = await response.json(); // Attempt to parse the response

    // Handle response status codes appropriately
    if (response.ok) {
      // If the request was successful
      return { success: true, message: data.message };
    } else {
      // Handle non-success responses
      return { success: false, error: data.error };
    }
  } catch (error) {
    // Handle network errors or issues with the request
    console.error("Network or other error:", error.message);
    return { success: false, error: "Network or other error occurred." };
  }
};

/**
 * Creates a new night watch within a community based on provided details.
 *
 * @param {string} serverIP - The server IP address.
 * @param {Object} nightWatchData - Details of the night watch including date, location, and community information.
 * @returns {Promise<string>} - A promise that resolves with a success message or an error message.
 */
export const createNewNightWatch = async (serverIP, nightWatchData) => {
  const url = `${serverIP}/night_watch/add_night_watch`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nightWatchData),
    });
    const data = await response.json();
    // Handle different status codes as per the Flask API
    switch (response.status) {
      case 200:
        // Success case
        return data.message;
      case 400:
        // Missing required fields
        alert("Error: Missing required fields.");
        break;
      case 404:
        // Initiator not found or not a member of the community
        alert("Error: " + data.error);
        break;
      case 409:
        // A night watch is already scheduled for this area and date or duplicate watch ID
        alert("Error: " + data.error);
        break;
      case 500:
        // Database error
        alert("Error: Database error.");
        break;
      default:
        // Other unexpected statuses
        alert("Error: An unexpected error occurred.");
        break;
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    alert("Error: Failed to communicate with the server.");
  }
};

/**
 * Closes an active night watch by marking it as completed based on its ID.
 *
 * @param {string} serverIP - The server IP address.
 * @param {string} watchId - The unique identifier of the night watch to close.
 * @returns {Promise<string>} - A promise that resolves with a success message confirming the closure of the night watch.
 */
export const closeNightWatch = async (serverIP, watchId) => {
  const url = `${serverIP}/night_watch/close_night_watch`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ watch_id: watchId }),
    });
    const data = await response.json();

    if (!response.ok) {
      // Custom error messages based on the status code
      switch (response.status) {
        case 400:
          throw new Error(data.error || "Missing watch_id field.");
        case 404:
          throw new Error(data.error || "Night watch not found.");
        default:
          throw new Error(
            data.error ||
              "Failed to close night watch due to an unexpected error."
          );
      }
    }

    return data; // Successfully closed the night watch
  } catch (error) {
    console.error("Error closing night watch:", error.message);
    throw error; // Re-throw the error to be handled or displayed by the caller
  }
};
