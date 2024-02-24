import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as SecureStore from "expo-secure-store";
// import { getConfig } from "../config/config";
import { useServerIP } from "../contexts/ServerIPContext";

// import UserIcon from "../assets/user-icon.png"; // Replace with your user icon image path

const LoginScreen = ({ navigation }) => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const serverIP = useServerIP();

  const handleLogin = async () => {
    if (!ID || !password) {
      Alert.alert("Error", "Please enter both a username and password.");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID, password: password }),
    };

    try {
      const response = await fetch(
        `${serverIP}/users/password`,
        requestOptions
      );

      const data = await response.json();

      if (response.status === 200) {
        await SecureStore.setItemAsync("user_id", ID);
        navigation.navigate("HomeScreen");
      } else if (response.status === 404) {
        Alert.alert("Wrong id", data.message || "Please check your id");
      } else if (response.status === 401) {
        Alert.alert(
          "Wrong password",
          data.message || "Please check your password"
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the server");
      console.error(error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>UrbanHive</Text>
        {/* <Image source={UserIcon} style={styles.userIcon} /> */}
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
          <Text style={styles.buttonText}>Log In</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    marginHorizontal: 30,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
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
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
  signUpText: {
    textAlign: "center",
    color: "white",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
