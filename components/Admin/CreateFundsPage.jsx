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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CreateFundsPage({ route, navigation }) {
  const { report } = route.params;

  const [title, setTitle] = useState(`Donation for ${report.title}`);
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const handleSubmit = () => {
    const fundDetails = {
      incidentId: report.id,
      title,
      description,
      goalAmount,
    };
    console.log("Launching campaign:", fundDetails);
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
        <Text style={styles.label}>Incident ID</Text>
        <Text style={styles.staticText}>{report.id}</Text>

        <Text style={styles.label}>Campaign Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
          placeholder="Explain how the funds will be used..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Funding Goal (Rs.)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={goalAmount}
          onChangeText={setGoalAmount}
        />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Launch Campaign</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },
  staticText: {
    fontSize: 16,
    color: "#222",
    backgroundColor: "#f1f3f4",
    padding: 12,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: 16,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
