import React, { createContext, useContext, useState, useEffect } from "react";
import { getConfig } from "../config/config";

/**
 * ServerIPContext provides a way to share the server's IP address across the entire application.
 * It uses React's Context API to store the IP address and makes it accessible via a custom hook.
 */
const ServerIPContext = createContext();

/**
 * Custom hook to access the server's IP address from the context.
 *
 * @returns {string} The server's IP address.
 */
export function useServerIP() {
  return useContext(ServerIPContext);
}

/**
 * ServerIPProvider fetches and provides the server's IP address to its child components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components that will consume the context.
 */
export const ServerIPProvider = ({ children }) => {
  const [serverIP, setServerIP] = useState("");

  useEffect(() => {
    /**
     * Fetches the server's IP address from the configuration.
     */
    const getServerIP = async () => {
      const ip = await getConfig();
      setServerIP(ip);
    };

    getServerIP();
  }, []);

  return (
    <ServerIPContext.Provider value={serverIP}>
      {children}
    </ServerIPContext.Provider>
  );
};
