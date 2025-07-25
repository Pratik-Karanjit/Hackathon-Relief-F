import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");

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
    switch (urgency) {
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
      {/* Header with Logo and Search */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Content Cards */}
      <View style={styles.contentContainer}>
        {cardData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.contentCard}
            onPress={() => navigation.navigate("UserViewDetails")}
          >
            {/* Card Header with Title and Time */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Card Title {item.id}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>

            {/* Location and Urgency Row */}
            <View style={styles.locationRow}>
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#666"
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
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

            {/* Description */}
            <Text style={styles.cardContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit.
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  cardTime: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
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
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
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
  cardContent: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 22,
    textAlign: "justify",
  },
});
