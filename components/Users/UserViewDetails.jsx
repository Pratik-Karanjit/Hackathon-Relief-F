import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function UserViewDetails({ navigation }) {
  // Dummy data
  const incident = {
    userName: "John Doe",
    postedTime: "2 hours ago",
    title: "Flood in Downtown Area",
    urgency: "High",
    location: "123 Main Street, Downtown",
    incidentTime: "10:30 AM",
    incidentDate: "July 25, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    images: [
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/301",
      "https://picsum.photos/400/302",
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.userName}>{incident.userName}</Text>
          <Text style={styles.postedTime}>{incident.postedTime}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{incident.title}</Text>

        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor:
                incident.urgency === "High"
                  ? "#ff4444"
                  : incident.urgency === "Medium"
                  ? "#ffbb33"
                  : "#00C851",
            },
          ]}
        >
          <Text style={styles.urgencyText}>{incident.urgency}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <Text style={styles.locationText}>{incident.location}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {incident.incidentTime}, {incident.incidentDate}
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{incident.description}</Text>

        <Text style={styles.imagesTitle}>Images</Text>
        <ScrollView
          horizontal
          style={styles.imageScroll}
          showsHorizontalScrollIndicator={false}
        >
          {incident.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postedTime: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  urgencyPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  urgencyText: {
    color: "#fff",
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
  },
  timeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 20,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  imageScroll: {
    marginBottom: 20,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
});
