import React, { createContext, useState, useContext } from "react";

/**
 * UserContext provides a way to manage user-related data and actions across the application.
 * It offers a global state for user information, such as friends, communities, and requests.
 */
const UserContext = createContext();

/**
 * Custom hook to access the current user's information and related functions.
 *
 * @returns {Object} The current user data and functions for managing it.
 */
export const useUser = () => useContext(UserContext);

/**
 * UserProvider manages user-related data and actions, providing a global context for them.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components that will consume the context.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * Saves the user's data into the context.
   *
   * @param {Object} userData - The data of the current user.
   */
  const SaveUser = (userData) => {
    setUser(userData);
  };

  /**
   * Adds a new community to the user's communities list.
   *
   * @param {Object} newCommunity - The new community to add.
   */
  const updateUserCommunities = (newCommunity) => {
    setUser((prevUser) => ({
      ...prevUser,
      communities: [...prevUser.communities, newCommunity],
    }));
  };

  /**
   * Adds a new friend to the user's friends list.
   *
   * @param {Object} newFriend - The new friend to add.
   */
  const addFriend = (newFriend) => {
    setUser((prevUser) => ({
      ...prevUser,
      friends: [...prevUser.friends, newFriend],
    }));
  };

  /**
   * Removes a user's request based on the sender ID.
   *
   * @param {string} senderId - The ID of the user whose request is to be removed.
   */
  const removeUserRequest = (senderId) => {
    setUser((prevUser) => ({
      ...prevUser,
      requests: prevUser.requests.filter((req) => req.id !== senderId),
    }));
  };

  /**
   * Logs out the user by clearing the user's state and deleting the ID from secure storage.
   */
  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user_id");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        SaveUser,
        updateUserCommunities,
        addFriend,
        removeUserRequest,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
