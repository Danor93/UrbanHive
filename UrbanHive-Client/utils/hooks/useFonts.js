import { useState, useEffect } from "react";
import * as Font from "expo-font";

/**
 * Custom hook for loading custom fonts using Expo's Font module.
 *
 * @param {Object} fontMap - An object mapping font aliases to font file paths.
 * @returns {boolean} - Boolean state indicating whether the fonts are loaded.
 */
const useFonts = async (fontMap) => {
  // State to track if fonts are loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    /**
     * Loads fonts asynchronously and updates state upon completion or error.
     */
    async function loadFonts() {
      try {
        await Font.loadAsync(fontMap); // Attempt to load the fonts passed via fontMap
        setFontsLoaded(true); // Set fonts loaded state to true upon successful loading
      } catch (error) {
        console.log("Error loading fonts", error); // Log any errors encountered during font loading
      }
    }

    loadFonts(); // Trigger the font loading
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return fontsLoaded; // Return the state of font loading
};

export default useFonts;
