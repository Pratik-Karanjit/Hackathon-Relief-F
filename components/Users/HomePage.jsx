import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const cardData = [
    { id: 1, location: "New York, NY", urgency: "high", time: "2 hours ago" },
    {
      id: 2,
      location: "Los Angeles, CA",
      urgency: "medium",
      time: "4 hours ago",
    },
    { id: 3, location: "Chicago, IL", urgency: "low", time: "6 hours ago" },
    { id: 4, location: "Miami, FL", urgency: "high", time: "1 hour ago" },
    { id: 5, location: "Seattle, WA", urgency: "medium", time: "3 hours ago" },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "#dc3545"; // Red
      case "medium":
        return "#fd7e14"; // Orange
      case "low":
        return "#28a745"; // Green
      default:
        return "#6c757d"; // Gray
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relief</Text>
      </View>

      <View style={styles.contentContainer}>
        {cardData.map((item) => (
          <TouchableOpacity
  key={item.id}
  style={styles.contentCard}
  onPress={() => navigation.navigate("UserViewDetails")}
>
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>Card Title {item.id}</Text>
    <View
      style={[
        styles.urgencyBadge,
        { backgroundColor: getUrgencyColor(item.urgency) },
      ]}
    >
      <Text style={styles.urgencyText}>
        {item.urgency.toUpperCase()}
      </Text>
    </View>
  </View>

  <Text style={styles.cardTime}>{item.time}</Text>



  <Text style={styles.cardContent}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </Text>
</TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  contentContainer: {
    padding: 16,
  },
  contentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f3f4",
  },
  urgencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  urgencyText: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
   cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTime: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },
  cardContent: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 22,
    textAlign: "justify",
  },
});