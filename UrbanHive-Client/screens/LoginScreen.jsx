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

const LoginScreen = ({ navigation }) => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const serverIP = useServerIP();

  const handleLogin = async () => {
    if (!ID || !password) {
      Alert.alert("Error", "Please enter both a username and password.");
      return;
    }

    try {
      const { status, data } = await loginUser(serverIP, ID, password);

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
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
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
