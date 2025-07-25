import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// import MapView, { Marker } from "react-native-maps"; // optional if map needed

export default function ReportDetailScreen({ route, navigation }) {
  //   const route = useRoute();
  const { report } = route.params;
  console.log(report);

  const timeAgo = "8 min ago"; // Simulated, replace with time lib if needed

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.time}>
        {report.time} • {timeAgo}
      </Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.description}>{report.description}</Text>

      <Text style={styles.label}>
        Flag Count: <Text style={styles.count}>{report.flagCount}</Text>
      </Text>
      <Text style={styles.label}>
        Similar Reports:{" "}
        <Text style={styles.count}>{report.similarCount || 0}</Text>
      </Text>

      <Text style={styles.label}>Location</Text>
      {report.coordinates ? (
        <Text style={styles.locationText}>
          Lat: {report.coordinates.lat}, Lng: {report.coordinates.lng}
        </Text>
      ) : (
        <Text style={styles.locationText}>No coordinates available</Text>
      )}

      {/* Optional Map (requires react-native-maps and permissions) */}
      {/* {report.coordinates && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.coordinates.lat,
            longitude: report.coordinates.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: report.coordinates.lat,
              longitude: report.coordinates.lng,
            }}
          />
        </MapView>
      )} */}

      <Text style={styles.label}>Images</Text>
      <View style={styles.imageContainer}>
        {/* Replace with real images */}
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.image}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.takeDownBtn}>
          <Text style={styles.buttonText}>Take Down Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fundBtn}>
          <Text style={styles.buttonText}>Launch Aid Campaign</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    marginHorizontal: -20,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: "#007bff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 14,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  locationText: {
    fontSize: 13,
    color: "#444",
  },
  count: {
    color: "#007bff",
  },
  imageContainer: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  map: {
    height: 200,
    width: "100%",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  takeDownBtn: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  fundBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
