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
// import UserIcon from "../assets/user-icon.png"; // Replace with your user icon image path

const LoginScreen = ({ navigation }) => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!ID || !password) {
      Alert.alert("Error", "Please enter both a username and password.");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ID, password: password }),
    };

    // TODO: Replace with your actual API endpoint and include necessary headers
    try {
      const server_ip = await getConfig();
      console.log(server_ip);
      const response = await fetch(
        `${server_ip}/user/password/`,
        requestOptions
      );

      const data = await response.json();

      if (response.ok) {
        // Handle the successful login here
        Alert.alert("Success", "Logged in successfully");
      } else {
        // Handle errors, such as incorrect credentials
        Alert.alert(
          "Login Failed",
          data.message || "Please check your credentials"
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the server");
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
