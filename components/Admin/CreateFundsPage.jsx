import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../../services/api";

export default function CreateFundsPage({ route, navigation }) {
  const { report, incidentId, isAdmin } = route.params || {};

  const [title, setTitle] = useState(`Aid Campaign for ${report?.title || 'Incident'}`);
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a campaign title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a campaign description");
      return;
    }

    if (!goalAmount || parseFloat(goalAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid funding goal amount");
      return;
    }

    setIsLoading(true);

    try {
      const donationData = {
        incidentId: incidentId || report?.id || report?.incidentId,
        donationLimit: parseFloat(goalAmount),
        // Optional: Add additional fields if needed
        title: title.trim(),
        description: description.trim(),
      };

      console.log("Creating donation campaign with data:", donationData);

      const response = await api.post('/donations/createDonation', donationData);

      console.log("Donation creation response:", response.data);

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success",
          "Aid campaign has been launched successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to the previous screen or dashboard
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error("Unexpected response status");
      }

    } catch (error) {
      console.error("Error creating donation campaign:", error);

      let errorMessage = "Failed to launch aid campaign. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          errorMessage = data.message || "Invalid campaign data provided.";
        } else if (status === 401) {
          errorMessage = "Please login again to create campaigns.";
        } else if (status === 403) {
          errorMessage = "You do not have permission to create campaigns.";
        } else if (status === 409) {
          errorMessage = "A campaign for this incident already exists.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerText}>Create Aid Campaign</Text>
      </View>

      {/* Content + Scroll */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Incident Information */}
        <View style={styles.incidentInfo}>
          <Text style={styles.sectionTitle}>Incident Details</Text>
          <Text style={styles.incidentTitle}>{report?.title || 'Incident Report'}</Text>
          <Text style={styles.incidentDescription}>
            {report?.description || 'No description available'}
          </Text>
          {report?.urgencyLevel && (
            <View style={[
              styles.urgencyBadge,
              { backgroundColor: getUrgencyColor(report.urgencyLevel) }
            ]}>
              <Text style={styles.urgencyText}>
                {report.urgencyLevel.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Campaign Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter campaign title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
          placeholder="Explain how the funds will be used and the impact it will make..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Funding Goal (Rs.)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={goalAmount}
          onChangeText={setGoalAmount}
        />

        {/* Campaign Preview */}
        {(title || description || goalAmount) && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Campaign Preview</Text>
            <View style={styles.previewCard}>
              {title && <Text style={styles.previewTitle}>{title}</Text>}
              {goalAmount && (
                <Text style={styles.previewGoal}>
                  Target: Rs. {parseFloat(goalAmount || 0).toLocaleString()}
                </Text>
              )}
              {description && (
                <Text style={styles.previewDescription} numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Launch Campaign (Rs. {goalAmount || '0'})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Helper function for urgency colors
const getUrgencyColor = (urgency) => {
  switch (urgency?.toUpperCase()) {
    case "HIGH":
      return "#dc3545"; // Red
    case "MEDIUM":
      return "#fd7e14"; // Orange
    case "LOW":
      return "#28a745"; // Green
    default:
      return "#6c757d"; // Gray
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for button
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 4,
  },
  incidentInfo: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  incidentDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  urgencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  previewSection: {
    marginTop: 24,
  },
  previewCard: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#28a745",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  previewGoal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#95d5b2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});