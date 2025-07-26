import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

export default function ProfilePage() {
  const user = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    contact: "+977-9800000000",
    address: "Kathmandu, Nepal",
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const [canVolunteer, setCanVolunteer] = useState(true);
  const [canDonate, setCanDonate] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  const renderMenu = () => (
    <Modal
      transparent={true}
      visible={menuVisible}
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleLogout();
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderToggle = (label, value, onToggle) => (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.8}
        style={[
          styles.customSwitch,
          { backgroundColor: value ? "#4CAF50" : "#ccc" },
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            value ? styles.switchThumbEnabled : styles.switchThumbDisabled,
          ]}
        />
        <Text
          style={value ? styles.switchTextEnabled : styles.switchTextDisabled}
        >
          {value ? "Enabled" : "Disabled"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>
      {renderMenu()}

      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user.fullName}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contact Number</Text>
        <Text style={styles.value}>{user.contact}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{user.address}</Text>
      </View>

      {renderToggle("Can Volunteer", canVolunteer, () =>
        setCanVolunteer(!canVolunteer)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginHorizontal: -20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginRight: 5,
  },
  menuDots: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 4,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
  },
  toggleButton: {
    width: 90,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  enabled: {
    backgroundColor: "#4CAF50",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  customSwitch: {
    width: 120,
    height: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fff",
    position: "absolute",
    top: 6,
  },
  switchThumbEnabled: {
    left: 86,
  },
  switchThumbDisabled: {
    left: 6,
  },
  switchTextEnabled: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 35,
    left: -30,
  },
  switchTextDisabled: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 35,
    left: 18,
  },
});