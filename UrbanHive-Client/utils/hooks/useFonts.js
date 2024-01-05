import { useState, useEffect } from "react";
import * as Font from "expo-font";

const useFonts = async (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fontMap);
        setFontsLoaded(true);
      } catch (error) {
        console.log("Error loading fonts", error);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;
