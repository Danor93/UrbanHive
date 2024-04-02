import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const SaveUser = (userData) => {
    setUser(userData);
  };

  const updateUserCommunities = (newCommunity) => {
    setUser((prevUser) => ({
      ...prevUser,
      communities: [...prevUser.communities, newCommunity],
    }));
  };

  const removeUserRequest = (senderId) => {
    setUser((prevUser) => ({
      ...prevUser,
      requests: prevUser.requests.filter((req) => req.id !== senderId),
    }));
  };

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
        removeUserRequest,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
