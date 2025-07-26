import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ReportDetailScreen({ route, navigation }) {
  const { report } = route.params;
  const timeAgo = "8 min ago"; // You can calculate this dynamically later

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Incident Report</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.time}>
          {report.time} • {timeAgo}
        </Text>

        {/* Urgency */}
        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor:
                report.urgency === "high"
                  ? "#ff4444"
                  : report.urgency === "medium"
                  ? "#ffbb33"
                  : "#00C851",
            },
          ]}
        >
          <Text style={styles.urgencyText}>{report.urgency.toUpperCase()}</Text>
        </View>

        {/* Location and Time */}
        <View style={styles.detailsRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <Text style={styles.locationText}>{report.location}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {report.incidentTime || "—"}, {report.incidentDate || "—"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{report.description}</Text>

        {/* Flags + Similar Reports */}
        <Text style={styles.sectionTitle}>
          Flag Count: <Text style={styles.count}>{report.flagCount}</Text>
        </Text>
        <Text style={styles.sectionTitle}>
          Similar Reports:{" "}
          <Text style={styles.count}>{report.similarCount || 0}</Text>
        </Text>

        {/* Coordinates */}
        <Text style={styles.sectionTitle}>Location</Text>
        {report.coordinates ? (
          <Text style={styles.locationText}>
            Lat: {report.coordinates.lat}, Lng: {report.coordinates.lng}
          </Text>
        ) : (
          <Text style={styles.locationText}>No coordinates available</Text>
        )}

        {/* Images */}
        <Text style={styles.sectionTitle}>Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(report.images || []).map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.takeDownBtn}>
          <Text style={styles.buttonText}>Take Down Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fundBtn}
          onPress={() => navigation.navigate("CreateFundsPage", { report })}
        >
          <Text style={styles.buttonText}>Launch Aid Campaign</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 5,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  logo: {
    backgroundColor: "#007bff",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  urgencyPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  urgencyText: {
    color: "#fff",
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#444",
  },
  timeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  count: {
    color: "#007bff",
  },
  image: {
    width: 260,
    height: 180,
    borderRadius: 12,
    marginRight: 12,
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  takeDownBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fundBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for bottom buttons
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
});
