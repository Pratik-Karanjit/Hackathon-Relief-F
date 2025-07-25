import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AdminHomePage({ navigation }) {
  const [searchText, setSearchText] = useState("");

  const cardData = [
    {
      id: 1,
      title: "House Fire",
      location: "New York, NY",
      urgency: "high",
      description:
        "Extremely huge fire in one room of the house, residents are outside but the fire is spreading fast",
      time: "2 hours ago",
      flagCount: 0,
    },
    {
      id: 2,
      title: "Medical Emergency",
      location: "Los Angeles, CA",
      urgency: "medium",
      description:
        "Person fainted near downtown LA. Needs ambulance and basic CPR immediately.",
      time: "4 hours ago",
      flagCount: 2,
    },
    {
      id: 3,
      title: "Flooding",
      location: "Chicago, IL",
      urgency: "low",
      description:
        "Slight water rise in local street due to blocked drains. Residents worried about basement flooding.",
      time: "6 hours ago",
      flagCount: 1,
    },
    {
      id: 4,
      title: "Car Accident",
      location: "Miami, FL",
      urgency: "high",
      description:
        "Two vehicles crashed on highway, one overturned. Police and ambulance requested urgently.",
      time: "1 hour ago",
      flagCount: 0,
    },
    {
      id: 5,
      title: "Power Outage",
      location: "Seattle, WA",
      urgency: "medium",
      description:
        "Several households have lost power. Children and elderly in distress. Possibly transformer issue.",
      time: "3 hours ago",
      flagCount: 6,
    },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "#dc3545";
      case "medium":
        return "#fd7e14";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>ADMIN</Text>
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

      {cardData.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate("ReportDetail", { report: item })}
        >
          <View
            key={item.id}
            style={[
              styles.contentCard,
              item.flagCount > 5 && styles.flaggedCard,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>

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

            <Text style={styles.cardContent}>{item.description}</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="flag"
                size={16}
                color="#dc3545"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.flagText}>
                {item.flagCount} flag{item.flagCount !== 1 ? "s" : ""}
                {item.flagCount > 5 ? " — marked as suspicious" : ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
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
    backgroundColor: "#dc3545",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f3f4",
  },
  flaggedCard: {
    backgroundColor: "#ffe6e6",
    borderColor: "#ff4d4d",
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
    marginBottom: 6,
  },
  flagText: {
    marginTop: 4,
    color: "#c0392b",
    fontWeight: "600",
    fontSize: 13,
  },
});
