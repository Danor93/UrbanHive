import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const ForgotPasswordScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  const handlePasswordReset = async () => {
    try {
      const server_ip = await getConfig();
      const response = await fetch(`${server_ip}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIdentifier: input }),
      });

      navigation.navigate("ResetPassword");

      const data = await response.json();
      if (data.success) {
        // Handle the success scenario (e.g., show a message, redirect to login)
      } else {
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            {/* Title at the top */}
            <Text style={styles.title}>UrbanHive</Text>

            {/* Centered content */}
            <View style={styles.centeredContent}>
              <Text style={styles.subtitle}>Enter your email:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setInput}
                value={input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handlePasswordReset}
              >
                <Text style={styles.buttonText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up at the bottom */}
            <TouchableOpacity
              style={styles.signupTouchable}
              onPress={() => navigation.navigate("CreateAccount")}
            >
              <Text style={styles.subtitle}>Don't have an account? </Text>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    color: "white",
    alignSelf: "center",
    marginTop: 30,
    fontFamily: "EncodeSansExpanded-ExtraBold",
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "EncodeSansExpanded-Bold",
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    width: "80%",
    borderRadius: 30,
    color: "black",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    marginVertical: 5,
    width: "80%",
    height: 40,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  signupTouchable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
    paddingBottom: 20,
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
