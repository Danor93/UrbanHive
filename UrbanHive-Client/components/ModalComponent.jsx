import React from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import DatePicker from "react-native-date-picker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
/**
 * ModalComponent provides an interface for creating and managing a night watch.
 * It uses two modals: one for inputting general watch information and another for selecting a map location.
 *
 * @param {Object} props
 * @param {boolean} props.isModalVisible - Controls the visibility of the main modal.
 * @param {function} props.setModalVisible - Function to toggle the main modal visibility.
 * @param {boolean} props.isMapModalVisible - Controls the visibility of the map modal.
 * @param {function} props.setMapModalVisible - Function to toggle the map modal visibility.
 * @param {Date} props.watchDate - The selected date for the night watch.
 * @param {function} props.setWatchDate - Function to set the watch date.
 * @param {string} props.watchRadius - The radius for the watch, in kilometers.
 * @param {function} props.setWatchRadius - Function to set the watch radius.
 * @param {string} props.positionsAmount - The number of positions available for the watch.
 * @param {function} props.setPositionsAmount - Function to set the positions amount.
 * @param {Object} props.selectedLocation - The selected geographical location for the watch.
 * @param {function} props.setSelectedLocation - Function to set the selected location.
 * @param {function} props.handleCreateNightWatch - Function to trigger the creation of the night watch.
 * @param {Object} props.userLocation - The user's current geographical location.
 * @param {function} props.onMapPress - Function to handle map press events.
 * @param {Object} props.styles - Styles applied to the component.
 */
const ModalComponent = ({
  isModalVisible,
  setModalVisible,
  isMapModalVisible,
  setMapModalVisible,
  watchDate,
  setWatchDate,
  watchRadius,
  setWatchRadius,
  positionsAmount,
  setPositionsAmount,
  selectedLocation,
  setSelectedLocation,
  handleCreateNightWatch,
  userLocation,
  onMapPress,
  styles,
}) => {
  const closeMapModal = () => setMapModalVisible(false);

  return (
    <>
      {/* Main modal for night watch inputs */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Close button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Date picker for watch date */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.label}>Watch Date:</Text>
              <DatePicker
                date={watchDate}
                onDateChange={setWatchDate}
                mode="date"
                theme="light"
                textColor="black"
                androidVariant="iosClone"
              />
            </View>

            {/* Watch radius input */}
            <Text style={styles.label}>Watch Radius (km):</Text>
            <TextInput
              placeholder="Watch Radius"
              value={watchRadius}
              onChangeText={setWatchRadius}
              keyboardType="numeric"
              style={styles.textInput}
            />

            {/* Positions amount input */}
            <Text style={styles.label}>Positions Amount:</Text>
            <TextInput
              placeholder="Positions Amount"
              value={positionsAmount}
              onChangeText={setPositionsAmount}
              keyboardType="numeric"
              style={styles.textInput}
            />

            {/* Button to open the map modal */}
            <TouchableOpacity
              onPress={() => setMapModalVisible(true)}
              style={styles.openMapButton}
            >
              <Text style={styles.openMapButtonText}>
                Choose Location on Map
              </Text>
            </TouchableOpacity>

            {/* Button to create the night watch */}
            <TouchableOpacity
              onPress={handleCreateNightWatch}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map modal for selecting a location */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMapModalVisible}
        onRequestClose={closeMapModal}
      >
        <View style={styles.mapModalView}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={onMapPress}
            provider={PROVIDER_GOOGLE}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>

          {/* Close button for map modal */}
          <TouchableOpacity
            onPress={closeMapModal}
            style={styles.closeMapButton}
          >
            <Text style={styles.closeMapButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default ModalComponent;
