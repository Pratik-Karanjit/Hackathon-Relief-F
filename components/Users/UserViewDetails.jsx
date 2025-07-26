import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from 'react-native-maps';
import { Constants } from '../../constants';

export default function UserViewDetails({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Dummy data
  const incident = {
  incidentId: 1,
  title: "Flood in Bhaktapur",
  longitude: 85.429,
  latitude: 27.672,
  urgencyLevel: "HIGH",
  description: "River has overflowed and flooded homes near the main road.",
  organizationType: "POLICE",
  incidentDate: "2025-07-26T10:30:00",
  listedDate: "2025-07-26T13:49:21.004848",
  images: [
    {
      imagePath: "https://res.cloudinary.com/deytqgusq/image/upload/v1753517062/incidents/smk35mfftdw2vxy3bfec.jpg",
      imageType: "jpg"
    },
    {
      imagePath: "https://res.cloudinary.com/deytqgusq/image/upload/v1753517063/incidents/s9jbnsois6oufcvdjnhq.jpg",
      imageType: "jpg"
    }
  ],
  uploader: {
    userId: 1,
    firstName: "Amogh",
    lastName: "Bajracharya"
  }
};

  // Donation data
  const donationData = {
    goal: 50000,
    raised: 32500,
    donorCount: 127,
    description: "Funds will be used to provide emergency relief supplies, temporary shelter, and clean water to flood victims in the downtown area. Your donation will directly help families rebuild their lives."
  };

  const progressPercentage = (donationData.raised / donationData.goal) * 100;

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid donation amount');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_BASE_URL/initialize-esewa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(donationAmount),
          incidentId: 'incident_id_here', // Add actual incident ID
          // Add other required fields for eSewa
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Donation initiated successfully');
        setModalVisible(false);
        setDonationAmount('');
        // Handle eSewa redirection or next steps
      } else {
        Alert.alert('Error', result.message || 'Failed to initialize donation');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Donation error:', error);
    }
  };

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
                      onPress: () => {
                        // 🔴 Handle flag post logic here
                        Alert.alert("Flagged", "This post has been flagged.");
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
        <Text style={styles.title}>{incident.title}</Text>

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
          <Text style={styles.urgencyText}>{incident.urgencyLevel}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {new Date(incident.incidentDate).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}, {new Date(incident.incidentDate).toLocaleDateString()}
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
          {incident.images.map((img, index) => (
            <Image key={index} source={{ uri: img.imagePath }} style={styles.image} />
          ))}
        </ScrollView>
        {/* Add Map Section */}
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
        {/* Donate Button */}
        <TouchableOpacity
          style={styles.donateButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="heart" size={20} color="#fff" style={styles.donateIcon} />
          <Text style={styles.donateButtonText}>Donate Now</Text>
        </TouchableOpacity>
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
                    Rs. {donationData.raised.toLocaleString()} raised
                  </Text>
                  <Text style={styles.goalAmount}>
                    of Rs. {donationData.goal.toLocaleString()} goal
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(progressPercentage, 100)}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {progressPercentage.toFixed(1)}%
                  </Text>
                </View>

                <Text style={styles.donorCount}>
                  {donationData.donorCount} people have donated
                </Text>
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
                  Donate Rs. {donationAmount || '0'}
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
  },
  headerTitle:{
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
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  timeContainer: {
    flex: 1,
    alignItems: "flex-start", // Changed from flex-end
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
    backgroundColor: "#007bff",
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