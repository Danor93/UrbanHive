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

const ResetPasswordScreen = ({ route, navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { token } = route.params; // Assuming you're passing the token as a route parameter

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://your-flask-api.com/reset/" + token,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: password }),
        }
      );

      const data = await response.json();
      if (data.message) {
        Alert.alert("Success", data.message);
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Error", "Could not reset password.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while trying to reset the password."
      );
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Your Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
    fontFamily: "EncodeSansExpanded-ExtraBold",
  },
  input: {
    height: 40,
    width: "80%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
