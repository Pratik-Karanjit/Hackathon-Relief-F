import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { Constants } from "../../constants";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserViewDetails({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get incidentId from route params
  const { incidentId, incident: fallbackIncident } = route.params || {};

  // Donation data (you might want to fetch this from API too)
  const donationData = {
    goal: 50000,
    raised: 32500,
    donorCount: 127,
    description:
      "Funds will be used to provide emergency relief supplies, temporary shelter, and clean water to flood victims in the downtown area. Your donation will directly help families rebuild their lives.",
  };

  useEffect(() => {
    if (incidentId) {
      fetchIncidentDetails();
    } else if (fallbackIncident) {
      // Use fallback incident data if available
      setIncident(fallbackIncident);
      setIsLoading(false);
    } else {
      setError("No incident ID provided");
      setIsLoading(false);
    }
  }, [incidentId]);

  const fetchIncidentDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching incident details for ID:", incidentId);

      const response = await api.get(`/incident/${incidentId}`);

      console.log("Incident details response:", response.data);

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

        console.log("Processed incident data:", incidentData);
        setIncident(incidentData);
      }
    } catch (error) {
      console.error("Error fetching incident details:", error);

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

      if (fallbackIncident) {
        console.log("Using fallback incident data");
        setIncident(fallbackIncident);
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

  const progressPercentage =
    incident?.donation?.collectedAmount && incident?.donation?.donationLimit
      ? (incident.donation.collectedAmount / incident.donation.donationLimit) *
        100
      : 0;

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid donation amount");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      const payload = {
        donationId: incident?.donation?.donationId || incident?.donationId,
        amount: parseFloat(donationAmount),
        userId: parseInt(userId),
        anonymous: false,
      };

      const response = await api.post("/donations/contribute", payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Thank you!", "Donation successful.");
        setModalVisible(false);
        setDonationAmount("");

        if (incidentId) {
          fetchIncidentDetails();
        }
      } else {
        Alert.alert("Error", response.data.message || "Donation failed.");
      }
    } catch (error) {
      console.error("Donation error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Network error. Please try again."
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading incident details...</Text>
      </View>
    );
  }

  // Error state
  if (error && !incident) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No incident data
  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color="#6c757d" />
        <Text style={styles.errorText}>No incident data available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incident Report</Text>
        </View>
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
                  "Flag Post",
                  "Are you sure you want to flag this post?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Yes, Flag it",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          const userId = await AsyncStorage.getItem("userId");
                          const response = await api.post(
                            `/incident/${incidentId}/flag`,
                            null,
                            { params: { userId } }
                          );

                          Alert.alert("Flagged", "This post has been flagged.");
                          console.log("Flag response:", response.data);
                        } catch (err) {
                          console.error("Error flagging post:", err);
                          Alert.alert("Error", "Failed to flag the post.");
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.dropdownItem}>Flag Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{incident.title || "Incident Report"}</Text>

        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor:
                incident.urgencyLevel === "HIGH"
                  ? "#ff4444"
                  : incident.urgencyLevel === "MEDIUM"
                  ? "#ffbb33"
                  : "#00C851",
            },
          ]}
        >
          <Text style={styles.urgencyText}>
            {incident.urgencyLevel || "UNKNOWN"}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {incident.incidentDate ? (
                <>
                  {new Date(incident.incidentDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  , {new Date(incident.incidentDate).toLocaleDateString()}
                </>
              ) : (
                "Date not available"
              )}
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>
          {incident.description || "No description available."}
        </Text>

        {/* Images Section */}
        {incident.images && incident.images.length > 0 && (
          <>
            <Text style={styles.imagesTitle}>Images</Text>
            <ScrollView
              horizontal
              style={styles.imageScroll}
              showsHorizontalScrollIndicator={false}
            >
              {incident.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.imagePath }}
                  style={styles.image}
                  onError={() =>
                    console.log("Failed to load image:", img.imagePath)
                  }
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Map Section */}
        {incident.latitude && incident.longitude && (
          <>
            <Text style={styles.mapTitle}>Location</Text>
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

        {/* Donate Button */}
        {incident?.donation?.open && (
          <TouchableOpacity
            style={styles.donateButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name="heart"
              size={20}
              color="#fff"
              style={styles.donateIcon}
            />
            <Text style={styles.donateButtonText}>Donate Now</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Donation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Support This Cause</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Topic */}
              <Text style={styles.donationTopic}>{incident.title}</Text>

              {/* Progress Section */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.raisedAmount}>
                    {/* Rs. {donationData.raised.toLocaleString()} raised */}
                    Rs.{" "}
                    {incident?.donation?.collectedAmount?.toLocaleString() ||
                      "0"}{" "}
                    raised
                  </Text>
                  <Text style={styles.goalAmount}>
                    of Rs. {incident?.donation?.donationLimit?.toLocaleString()}{" "}
                    goal
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(progressPercentage, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {progressPercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.donationDescription}>
                  {donationData.description}
                </Text>
              </View>

              {/* Amount Input */}
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Enter Amount (Rs.)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  value={donationAmount}
                  onChangeText={setDonationAmount}
                  keyboardType="numeric"
                />
              </View>

              {/* Donate Button */}
              <TouchableOpacity
                style={styles.modalDonateButton}
                onPress={handleDonate}
              >
                <Text style={styles.modalDonateButtonText}>
                  Donate Rs. {donationAmount || "0"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
    backgroundColor: "#6c757d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
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
  mapTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
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
  timeContainer: {
    flex: 1,
    alignItems: "flex-start",
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
  donateButton: {
    backgroundColor: "#28a745",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  donateIcon: {
    marginRight: 8,
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  donationTopic: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    margin: 20,
    marginBottom: 15,
  },
  progressSection: {
    margin: 20,
    marginTop: 0,
  },
  progressHeader: {
    marginBottom: 10,
  },
  raisedAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
  },
  goalAmount: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#28a745",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    minWidth: 45,
  },
  donorCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  descriptionContainer: {
    backgroundColor: "#f8f9fa",
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  donationDescription: {
    fontSize: 16,
    color: "#495057",
    lineHeight: 20,
  },
  amountSection: {
    margin: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
  },
  modalDonateButton: {
    backgroundColor: "#28a745",
    margin: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modalDonateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
