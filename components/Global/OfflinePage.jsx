import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OfflinePage() {
  const emergencyContacts = [
    { name: 'Police', number: '100', icon: 'shield-checkmark' },
    { name: 'Fire', number: '101', icon: 'flame' },
    { name: 'Ambulance', number: '102', icon: 'medical' },
  ];

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.offlineSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="wifi" size={60} color="#666" />
          <View style={styles.slash} />
        </View>
        <Text style={styles.offlineText}>You are currently offline</Text>
      </View>

      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.number}
            style={styles.contactButton}
            onPress={() => handleCall(contact.number)}
          >
            <View style={styles.contactInfo}>
              <Ionicons name={contact.icon} size={24} color="#fff" />
              <Text style={styles.contactName}>{contact.name}</Text>
            </View>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
    alignItems: 'center',
  },
  offlineSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slash: {
    position: 'absolute',
    width: 84,
    height: 3,
    backgroundColor: '#ff4444',
    transform: [{ rotate: '45deg' }],
    top: '50%',
    left: -12, 
  },
  offlineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emergencySection: {
    width: '90%',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  contactNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});