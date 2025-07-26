import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loginResponse, setLoginResponse] = useState(null);

  // Incident data states
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filter parameters
  const [filters, setFilters] = useState({
    urgencyLevel: '', // '', 'LOW', 'MEDIUM', 'HIGH'
    organizationType: '', // '', 'POLICE', 'FIRE', 'MEDICAL', etc.
    dateFilter: '', // '', 'TODAY', 'WEEK', 'MONTH'
    keyword: '',
    page: 0,
    size: 10
  });

  // Load user data from AsyncStorage
  useEffect(() => {
    loadUserData();
    fetchIncidents(); // Load incidents on component mount
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('loginResponse');

      if (data) {
        const parsedData = JSON.parse(data);
        setLoginResponse(parsedData);
      }

      // Get user data
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }

      // Get user token
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        setUserToken(storedToken);
      }

      // Get user role
      const storedRole = await AsyncStorage.getItem('userRole');
      if (storedRole) {
        setUserRole(storedRole);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchIncidents = async (page = 0, isRefresh = false) => {
    if (isLoading && !isRefresh) return;

    setIsLoading(true);
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const requestData = {
        urgencyLevel: filters.urgencyLevel,
        organizationType: filters.organizationType,
        dateFilter: filters.dateFilter,
        keyword: filters.keyword,
        page: page,
        size: filters.size
      };

      console.log('Fetching incidents with filters:', requestData);

      const response = await api.post('/incident/filter', requestData);

      console.log('Full API response:', response.data);
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));

      // Log the content array specifically
      if (response.data.data && response.data.data.content) {
        console.log('Content array:', response.data.data.content);
        console.log('Content array length:', response.data.data.content.length);

        // Log each object in the content array
        response.data.data.content.forEach((item, index) => {
          console.log(`Content item ${index}:`, JSON.stringify(item, null, 2));
        });
      }

      if (response.status === 200) {
        // Handle the correct response structure based on your API
        let newIncidents = [];

        if (response.data.success && response.data.data) {
          // Your API returns: { code: 200, data: { content: [...] }, message: "...", success: true }
          if (response.data.data.content && Array.isArray(response.data.data.content)) {
            newIncidents = response.data.data.content;
            console.log('Extracted incidents:', newIncidents);
          }
        } else if (Array.isArray(response.data)) {
          // If response.data is directly an array
          newIncidents = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          // If response.data has a 'content' property with array (paginated response)
          newIncidents = response.data.content;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a 'data' property with array
          newIncidents = response.data.data;
        } else {
          // Fallback to empty array
          console.warn('Unexpected API response structure:', response.data);
          newIncidents = [];
        }

        console.log('Final incidents to display:', newIncidents);

        if (isRefresh || page === 0) {
          setIncidents(newIncidents);
          setCurrentPage(0);
        } else {
          setIncidents(prev => [...prev, ...newIncidents]);
        }

        setCurrentPage(page);

        // Update hasMore logic based on your pagination info
        if (response.data.data && response.data.data.totalPages) {
          setHasMore(page + 1 < response.data.data.totalPages);
        } else {
          setHasMore(newIncidents.length === filters.size);
        }
      }

    } catch (error) {
      console.error('Error fetching incidents:', error);

      // Set incidents to empty array on error to prevent undefined
      if (isRefresh || page === 0) {
        setIncidents([]);
      }

      let errorMessage = 'Failed to load incidents. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'Please login again to access incidents.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to view incidents.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchIncidents(0, true);
  };

  const loadMoreIncidents = () => {
    if (hasMore && !isLoading) {
      fetchIncidents(currentPage + 1);
    }
  };

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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Relief</Text>
      </View>

      {/* Incidents Section */}
      <View style={styles.contentContainer}>
        <View style={styles.incidentsHeader}>
          <Text style={styles.sectionTitle}>Recent Incidents</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={16} color="#007bff" />
          </TouchableOpacity>
        </View>

        {isLoading && incidents?.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading incidents...</Text>
          </View>
        ) : incidents?.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={styles.noDataText}>No incidents found</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchIncidents(0, true)}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {incidents?.map((incident) => (
              <TouchableOpacity
                key={incident.incidentId || incident.id}
                style={styles.contentCard}
                onPress={() => navigation.navigate("UserViewDetails", { incident })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {incident.title || 'Incident Report'}
                  </Text>
                  <View
                    style={[
                      styles.urgencyBadge,
                      { backgroundColor: getUrgencyColor(incident.urgencyLevel) },
                    ]}
                  >
                    <Text style={styles.urgencyText}>
                      {(incident.urgencyLevel || 'UNKNOWN').toUpperCase()}
                    </Text>
                  </View>
                </View>

                {incident.incidentDate && (
                  <Text style={styles.cardTime}>
                    {formatDate(incident.incidentDate)}
                  </Text>
                )}

                <Text style={styles.cardContent} numberOfLines={3}>
                  {incident.description || 'No description available.'}
                </Text>

                {incident.organizationType && (
                  <View style={styles.cardFooter}>
                    <Ionicons name="business-outline" size={14} color="#666" />
                    <Text style={styles.organizationText}>{incident.organizationType}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreIncidents}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#007bff" />
                ) : (
                  <Text style={styles.loadMoreText}>Load More</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
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
  // Incidents Styles
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  incidentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 12,
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
  urgencyText: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardTime: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  loadMoreText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
});