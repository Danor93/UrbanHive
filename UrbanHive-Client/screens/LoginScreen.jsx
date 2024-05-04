import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { useServerIP } from "../contexts/ServerIPContext";
import { loginUser } from "../utils/apiUtils";

/**
 * Component for user login, handling user input and authentication.
 *
 * @param {{ navigation: any }} props - Component props containing navigation details.
 */
const LoginScreen = ({ navigation }) => {
  // State for handling user ID input.
  const [ID, setID] = useState("");
  // State for handling user password input.
  const [password, setPassword] = useState("");
  // Context hook to retrieve the server IP address.
  const serverIP = useServerIP();

  /**
   * Handles the login button press event.
   * Validates input, makes an API call for authentication, and handles responses.
   */
  const handleLogin = async () => {
    // Validation for empty input fields.
    if (!ID || !password) {
      Alert.alert("Error", "Please enter both a username and password.");
      return;
    }

    try {
      // API call to authenticate the user.
      const { status, data } = await loginUser(serverIP, ID, password);

      // Handling different response statuses.
      if (status === "success") {
        await SecureStore.setItemAsync("user_id", ID);
        setID(""); // Reset the ID field
        setPassword(""); // Reset the password field
        navigation.navigate("HomeScreen");
      } else if (status === 404) {
        Alert.alert("Wrong id", data.message || "Please check your id");
      } else if (status === 401) {
        Alert.alert(
          "Wrong password",
          data.message || "Please check your password"
        );
      }
    } catch (error) {
      Alert.alert("Network Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>UrbanHive</Text>
        <TextInput
          style={styles.input}
          placeholder="ID"
          onChangeText={setID}
          value={ID}
          autoCapitalize="none"
          keyboardType="numeric"
          maxLength={9}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ForgetPassword");
          }}
        >
          <Text style={styles.forgotPassword}>Forgot Password? click here</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Styles for the component using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 30,
    color: "white",
    fontFamily: "EncodeSansExpanded-Bold",
    textAlign: "center",
    marginBottom: 24,
  },
  userIcon: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  forgotPassword: {
    textAlign: "center",
    color: "white",
    fontFamily: "EncodeSansExpanded-Regular",
    marginBottom: 15,
  },
  signUpText: {
    textAlign: "center",
    color: "white",
    fontFamily: "EncodeSansExpanded-Regular",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
