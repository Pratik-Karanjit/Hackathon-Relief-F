import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../../services/api';

export default function ProfilePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [canVolunteer, setCanVolunteer] = useState(true);
  const [originalVolunteerStatus, setOriginalVolunteerStatus] = useState(true);
  const [canDonate, setCanDonate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        setError('User ID not found. Please login again.');
        setIsLoading(false);
        return;
      }

      console.log('Fetching profile for userId:', userId);

      // Make API call using the interceptor
      const response = await api.get(`/user/profile/${userId}`);

      console.log('Profile response:', response.data);

      if (response.status === 200) {
        let userData = null;

        // Handle different response structures
        if (response.data.success && response.data.data) {
          userData = response.data.data;
        } else if (response.data.data) {
          userData = response.data.data;
        } else {
          userData = response.data;
        }

        console.log('Processed user data:', userData);
        setUser(userData);

        // Set volunteer status based on the 'volunteer' field from response
        let volunteerStatus = false;
        if (userData.volunteer !== undefined) {
          console.log('Setting volunteer status from API:', userData.volunteer);
          volunteerStatus = userData.volunteer === true;
        } else if (userData.canVolunteer !== undefined) {
          console.log('Setting volunteer status from canVolunteer field:', userData.canVolunteer);
          volunteerStatus = userData.canVolunteer === true;
        } else {
          console.log('No volunteer field found, defaulting to false');
          volunteerStatus = false;
        }

        setCanVolunteer(volunteerStatus);
        setOriginalVolunteerStatus(volunteerStatus);
        setShowUpdateButton(false); // Reset update button

        // Set donate status (keeping existing logic)
        if (userData.canDonate !== undefined) {
          setCanDonate(userData.canDonate === true);
        } else {
          setCanDonate(false);
        }

        // Log the final states for debugging
        console.log('Final volunteer status:', volunteerStatus);
        console.log('Final donate status:', userData.canDonate === true);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);

      let errorMessage = 'Failed to load profile. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'Please login again to access your profile.';
          await clearUserData();
        } else if (status === 403) {
          errorMessage = 'You do not have permission to view this profile.';
        } else if (status === 404) {
          errorMessage = 'Profile not found.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userData',
        'userId',
        'refreshToken',
        'userRole',
        'loginResponse',
        'fcmToken'
      ]);
      console.log('User data cleared from AsyncStorage');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      console.log('Requesting location permission...');

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to update volunteer status. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return null;
      }

      console.log('Location permission granted, getting current location...');

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
        maximumAge: 60000,
      });

      console.log('Current location:', location);

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Failed to get your current location. Please ensure location services are enabled and try again.'
      );
      return null;
    }
  };

  const updateVolunteerStatusOnBackend = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        return;
      }

      // If user is enabling volunteer status, request location
      let locationData = { latitude: null, longitude: null };

      if (canVolunteer) {
        Alert.alert(
          'Location Required',
          'To enable volunteer status, we need to access your current location. This helps match you with nearby incidents.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                // Reset volunteer status to original
                setCanVolunteer(originalVolunteerStatus);
                setShowUpdateButton(false);
                setIsUpdating(false);
              }
            },
            {
              text: 'Allow Location',
              onPress: async () => {
                const location = await requestLocationPermission();
                if (location) {
                  locationData = location;
                  proceedWithUpdate();
                } else {
                  // Reset volunteer status if location failed
                  setCanVolunteer(originalVolunteerStatus);
                  setShowUpdateButton(false);
                  setIsUpdating(false);
                }
              }
            }
          ]
        );
        return;
      } else {
        // If disabling volunteer status, proceed without location
        proceedWithUpdate();
      }

      async function proceedWithUpdate() {
        try {
          const updateData = {
            status: canVolunteer,
            longitude: locationData.longitude,
            latitude: locationData.latitude,
            userId: parseInt(userId, 10),
          };

          console.log('Updating volunteer status with data:', updateData);

          const response = await api.put('/user/updateVolunteerStatus', updateData);

          console.log('Update response:', response.data);

          if (response.status === 200) {
            Alert.alert(
              'Success',
              `Volunteer status ${canVolunteer ? 'enabled' : 'disabled'} successfully!`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setOriginalVolunteerStatus(canVolunteer);
                    setShowUpdateButton(false);
                    // Optionally refresh profile data
                    fetchUserProfile();
                  }
                }
              ]
            );
          }

        } catch (updateError) {
          console.error('Error updating volunteer status:', updateError);

          let errorMessage = 'Failed to update volunteer status. Please try again.';

          if (updateError.response) {
            const status = updateError.response.status;
            const data = updateError.response.data;

            if (status === 401) {
              errorMessage = 'Please login again to update your volunteer status.';
            } else if (status === 403) {
              errorMessage = 'You do not have permission to update volunteer status.';
            } else if (status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            } else {
              errorMessage = data.message || errorMessage;
            }
          } else if (updateError.request) {
            errorMessage = 'Network error. Please check your internet connection.';
          }

          Alert.alert('Update Failed', errorMessage);

          // Reset volunteer status to original on failure
          setCanVolunteer(originalVolunteerStatus);
          setShowUpdateButton(false);
        } finally {
          setIsUpdating(false);
        }
      }

    } catch (error) {
      console.error('Error in updateVolunteerStatusOnBackend:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setCanVolunteer(originalVolunteerStatus);
      setShowUpdateButton(false);
      setIsUpdating(false);
    }
  };

  const handleVolunteerToggle = () => {
    const newStatus = !canVolunteer;
    setCanVolunteer(newStatus);

    // Show update button if status changed from original
    if (newStatus !== originalVolunteerStatus) {
      setShowUpdateButton(true);
    } else {
      setShowUpdateButton(false);
    }

    console.log('Volunteer status toggled to:', newStatus);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);

              await clearUserData();

              Alert.alert(
                'Success',
                'Logged out successfully',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (navigation && navigation.navigate) {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Login' }],
                        });
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout properly');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRetry = () => {
    fetchUserProfile();
  };

  const updateDonateStatus = async (newStatus) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      // You can add an API call here to update donate status on backend
      // await api.put(`/user/profile/${userId}/donate-status`, { canDonate: newStatus });

      setCanDonate(newStatus);
      console.log('Donate status updated:', newStatus);
    } catch (error) {
      console.error('Error updating donate status:', error);
      Alert.alert('Error', 'Failed to update donate status');
    }
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
              setMenuVisible(false);
              handleLogout();
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

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>😕</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No user data
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>👤</Text>
        <Text style={styles.errorMessage}>No profile data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.value}>
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.fullName || user.name || 'N/A'}
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.username || 'N/A'}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email || 'N/A'}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Contact Number</Text>
        <Text style={styles.value}>{user.contact || user.phoneNumber || 'N/A'}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{user.address || 'N/A'}</Text>
      </View>

      {renderToggle("Can Volunteer", canVolunteer, handleVolunteerToggle)}

      {/* Update Button */}
      {showUpdateButton && (
        <TouchableOpacity
          style={[styles.updateButton, isUpdating && styles.disabledButton]}
          onPress={updateVolunteerStatusOnBackend}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Volunteer Status</Text>
          )}
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  errorText: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  updateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});