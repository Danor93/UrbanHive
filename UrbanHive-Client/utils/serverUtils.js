import * as SecureStore from "expo-secure-store";
import { useServerIP } from "../contexts/ServerIPContext";

/**
 * useServerIPValue is a custom hook that retrieves the server's IP address from the ServerIPContext.
 *
 * @returns {string} The server's IP address.
 */
export const useServerIPValue = () => {
  const serverIP = useServerIP();
  return serverIP;
};

/**
 * getUserDetails retrieves the current user's details from the server.
 *
 * @returns {Promise<Object>} A promise that resolves to the user's data.
 * @throws {Error} Throws an error if fetching user details fails.
 */
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
