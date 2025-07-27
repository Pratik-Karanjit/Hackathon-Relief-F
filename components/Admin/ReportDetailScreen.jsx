import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportDetailScreen({ route, navigation }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get report data from route params
  const { report } = route.params || {};
  const incidentId = report?.id || report?.incidentId;

  useEffect(() => {
    if (incidentId) {
      fetchIncidentDetails();
    } else if (report) {
      // Use fallback report data if available
      setIncident(report);
      setIsLoading(false);
    } else {
      setError("No incident data provided");
      setIsLoading(false);
    }
  }, [incidentId]);

  const fetchIncidentDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Admin fetching incident details for ID:", incidentId);

      const response = await api.get(`/incident/${incidentId}`);

      console.log("Admin incident details response:", response.data);

      if (response.status === 200) {
        let incidentData = null;

        // Handle different response structures
        if (response.data.success && response.data.data) {
          incidentData = response.data.data;
        } else if (response.data.data) {
          incidentData = response.data.data;
        } else {
          incidentData = response.data;
        }

        console.log("Admin processed incident data:", incidentData);
        setIncident(incidentData);
      }
    } catch (error) {
      console.error("Admin error fetching incident details:", error);

      let errorMessage = "Failed to load incident details. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = "Please login again to access incident details.";
        } else if (status === 403) {
          errorMessage = "You do not have permission to view this incident.";
        } else if (status === 404) {
          errorMessage = "Incident not found.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);

      // Use fallback report data if available
      if (report) {
        console.log("Using fallback report data");
        setIncident(report);
        setError(null);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (incidentId) {
      fetchIncidentDetails();
    }
  };

  const handleTakeDown = async () => {
    Alert.alert(
      "Take Down Report",
      "Are you sure you want to take down this incident report? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Down",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/incident/${incidentId}`);

              Alert.alert("Success", "Incident report has been taken down.", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack()
                }
              ]);
            } catch (error) {
              console.error("Error taking down report:", error);
              Alert.alert("Error", "Failed to take down the report. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Navigate to CreateFundsPage - NO MODAL HERE
  const handleLaunchCampaign = () => {
    console.log("Navigating to CreateFundsPage with report:", incident || report);

    try {
      navigation.navigate("CreateFundsPage", {
        report: incident || report,
        incidentId: incidentId,
        // Add additional context for admin
        isAdmin: true,
        source: 'ReportDetail'
      });
    } catch (navigationError) {
      console.error("Navigation error:", navigationError);
      Alert.alert(
        "Navigation Error",
        "Could not navigate to Create Funds page. Please check if the screen is properly configured in your navigation stack.",
        [
          { text: "OK" }
        ]
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Incident Report</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading incident details...</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Error state
  if (error && !incident) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Incident Report</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // No incident data
  if (!incident) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Incident Report</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={64} color="#6c757d" />
          <Text style={styles.errorText}>No incident data available</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

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
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>

        {/* Dropdown menu */}
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => {
                setShowDropdown(false);
                Alert.alert(
                  "Mark as Resolved",
                  "Are you sure you want to mark this incident as resolved?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Mark Resolved",
                      onPress: async () => {
                        try {
                          // Add API call to mark as resolved
                          // await api.put(`/incident/${incidentId}/resolve`);
                          Alert.alert("Success", "Incident marked as resolved.");
                        } catch (error) {
                          console.error("Error marking as resolved:", error);
                          Alert.alert("Error", "Failed to mark incident as resolved.");
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.dropdownItem}>Mark as Resolved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowDropdown(false);
                // Navigate to edit incident screen
                // navigation.navigate("EditIncident", { incidentId });
                Alert.alert("Info", "Edit functionality coming soon.");
              }}
            >
              <Text style={styles.dropdownItem}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{incident.title || "Incident Report"}</Text>

        <Text style={styles.time}>
          {incident.time || (incident.incidentDate ?
            new Date(incident.incidentDate).toLocaleString() :
            "Time not available"
          )}
        </Text>

        {/* Urgency */}
        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor:
                (incident.urgency === "high" || incident.urgencyLevel === "HIGH")
                  ? "#ff4444"
                  : (incident.urgency === "medium" || incident.urgencyLevel === "MEDIUM")
                    ? "#ffbb33"
                    : "#00C851",
            },
          ]}
        >
          <Text style={styles.urgencyText}>
            {(incident.urgency || incident.urgencyLevel || "UNKNOWN").toUpperCase()}
          </Text>
        </View>

        {/* Location and Details */}
        <View style={styles.detailsRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#666" />
            <Text style={styles.locationText}>
              {incident.location ||
                (incident.latitude && incident.longitude ?
                  `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}` :
                  "Location not available")}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {incident.description || "No description available."}
        </Text>

        {/* Admin-specific Information */}
        <Text style={styles.sectionTitle}>
          Flag Count: <Text style={styles.count}>{incident.flagCount || 0}</Text>
        </Text>
        <Text style={styles.sectionTitle}>
          Similar Reports: <Text style={styles.count}>{incident.similarCount || 0}</Text>
        </Text>

        {/* Organization Type */}
        {incident.organizationType && (
          <>
            <Text style={styles.sectionTitle}>Assigned Organization</Text>
            <Text style={styles.organizationText}>{incident.organizationType}</Text>
          </>
        )}

        {/* Coordinates */}
        {(incident.latitude && incident.longitude) && (
          <>
            <Text style={styles.sectionTitle}>Coordinates</Text>
            <Text style={styles.locationText}>
              Lat: {incident.latitude.toFixed(6)}, Lng: {incident.longitude.toFixed(6)}
            </Text>
          </>
        )}

        {/* Images */}
        {incident.images && incident.images.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Evidence Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {incident.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.imagePath || img.uri || img }}
                  style={styles.image}
                  onError={() => console.log('Failed to load image:', img)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Map Section */}
        {incident.latitude && incident.longitude && (
          <>
            <Text style={styles.sectionTitle}>Location Map</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: incident.latitude,
                  longitude: incident.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                  }}
                  title={incident.title}
                />
              </MapView>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.takeDownBtn}
          onPress={handleTakeDown}
        >
          <Text style={styles.buttonText}>Take Down Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fundBtn}
          onPress={handleLaunchCampaign}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginLeft: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for bottom buttons
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
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
    marginBottom: 8,
  },
  count: {
    color: "#007bff",
    fontWeight: "bold",
  },
  organizationText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  takeDownBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  fundBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});