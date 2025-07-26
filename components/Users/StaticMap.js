import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function CurrentLocationMap() {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Location permission not granted");
          return;
        }

        const current = await Location.getCurrentPositionAsync({});
        const initialCoords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(initialCoords);
        setSelectedLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (e) {
        console.log("Error getting location:", e);
      }
    })();
  }, []);

  console.log(selectedLocation, "selectedLocation");

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        onPress={(e) => {
          setSelectedLocation(e.nativeEvent.coordinate);
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width - 40,
    height: 300,
    borderRadius: 10,
  },
});
