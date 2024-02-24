import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useServerIP } from "../contexts/ServerIPContext";

export const useServerIPValue = () => {
  const serverIP = useServerIP();
  return serverIP;
};

export const getUserDetails = async () => {
  try {
    const serverIP = useServerIPValue();
    const userId = await SecureStore.getItemAsync("user_id");
    const response = await fetch(`${serverIP}/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw new Error(error.message);
  }
};
