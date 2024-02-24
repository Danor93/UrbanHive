// src/contexts/ServerIPContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { getConfig } from "../config/config";

const ServerIPContext = createContext();

export function useServerIP() {
  return useContext(ServerIPContext);
}

export const ServerIPProvider = ({ children }) => {
  const [serverIP, setServerIP] = useState("");

  useEffect(() => {
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
