import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getConfig } from "../config/config";
import LinearGradient from "react-native-linear-gradient";
import UrbanHiveLogo from "../assets/images/UrbanHive_Logo.png";
import * as Location from "expo-location";
import { useServerIP } from "../contexts/ServerIPContext";
import { createAccountWithLocation } from "../utils/apiUtils";

const CreateAccountScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to proceed."
        );
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      // Proceed with your location logic
    };

    getLocation();
  }, []);

  const serverIP = useServerIP();

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateInput = () => {
    // Simple validation checks

    const idRegex = /^\d{9}$/;
    if (!idRegex.test(formData.id)) {
      Alert.alert("Validation Error", "ID must be exactly 9 digits long");
      return false;
    }

    if (!formData.name || formData.name.length < 3) {
      Alert.alert(
        "Validation Error",
        "Name must be at least 3 characters long"
      );
      return false;
    }
    if (!formData.email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long"
      );
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert(
        "Validation Error",
        "Phone Number must be exactly 10 digits long"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      return; // Stop if the validation fails
    }

    //Request permission for location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to proceed."
      );
      return;
    }

    try {
      // Get the current location
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (addresses.length > 0) {
        const address = addresses[0];

        // Prepare the data to be sent to the server
        const locationData = {
          latitude,
          longitude,
          address: `${address.street}, ${address.city}, ${address.region}, ${address.country}`,
        };

        const accountDataWithLocation = {
          ...formData,
          location: locationData,
        };

        try {
          await createAccountWithLocation(serverIP, accountDataWithLocation);
          Alert.alert(
            "Success",
            "Account created successfully, location saved."
          );
          navigation.navigate("LoginScreen");
        } catch (error) {
          Alert.alert("Error", error.message);
        }
      } else {
        Alert.alert("Location Error", "Unable to fetch your address.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Location Error",
        "An error occurred while fetching your location."
      );
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#05403e", "#03af68"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.container}>
          <Image source={UrbanHiveLogo} style={styles.logo} />
          <Text style={styles.subtitle}>Create new Account</Text>
          <TextInput
            style={styles.input}
            placeholder="ID"
            onChangeText={(value) => handleChange("id", value)}
            keyboardType="numeric"
            maxLength={9}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(value) => handleChange("name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={(value) => handleChange("phoneNumber", value)}
            keyboardType="numeric"
            maxLength={10}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              navigation.navigate("LoginScreen");
            }}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            We need permission for the service you use
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 15,
    color: "black",
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  secondaryButton: {
    paddingVertical: 15,
    marginBottom: 15,
    alignSelf: "flex-end",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default CreateAccountScreen;
