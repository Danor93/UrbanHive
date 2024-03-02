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

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user_id");
  };

  return (
    <UserContext.Provider
      value={{ user, SaveUser, updateUserCommunities, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
