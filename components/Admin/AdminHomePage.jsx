import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function AdminHomePage({ navigation }) {
  const [searchText, setSearchText] = useState("");

  // State for API data
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filter parameters (same as HomePage.jsx)
  const [filters, setFilters] = useState({
    urgencyLevel: '', // '', 'LOW', 'MEDIUM', 'HIGH'
    organizationType: '', // '', 'POLICE', 'FIRE', 'MEDICAL', etc.
    dateFilter: '', // '', 'TODAY', 'WEEK', 'MONTH'
    keyword: searchText,
    page: 0,
    size: 10
  });

  // Load incidents on component mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Update keyword filter when search text changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setFilters(prev => ({ ...prev, keyword: searchText, page: 0 }));
      if (searchText.length > 2 || searchText.length === 0) {
        fetchIncidents(0, true); // Reset to first page when searching
      }
    }, 500); // 500ms delay for search

    return () => clearTimeout(delayedSearch);
  }, [searchText]);

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
        keyword: page === 0 ? searchText : filters.keyword, // Use current search text for new searches
        page: page,
        size: filters.size
      };

      console.log('Admin fetching incidents with filters:', requestData);

      const response = await api.post('/incident/filter', requestData);

      console.log('Admin API response:', response.data);

      if (response.status === 200) {
        let newIncidents = [];

        // Handle the response structure (same as HomePage.jsx)
        if (response.data.success && response.data.data) {
          if (response.data.data.content && Array.isArray(response.data.data.content)) {
            newIncidents = response.data.data.content;
          }
        } else if (Array.isArray(response.data)) {
          newIncidents = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          newIncidents = response.data.content;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          newIncidents = response.data.data;
        } else {
          console.warn('Unexpected API response structure:', response.data);
          newIncidents = [];
        }

        console.log('Admin processed incidents:', newIncidents);

        if (isRefresh || page === 0) {
          setIncidents(newIncidents);
          setCurrentPage(0);
        } else {
          setIncidents(prev => [...prev, ...newIncidents]);
        }

        setCurrentPage(page);

        // Update hasMore logic based on pagination info
        if (response.data.data && response.data.data.totalPages) {
          setHasMore(page + 1 < response.data.data.totalPages);
        } else {
          setHasMore(newIncidents.length === filters.size);
        }
      }

    } catch (error) {
      console.error('Admin error fetching incidents:', error);

      // Set incidents to empty array on error
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
    setSearchText(''); // Clear search on refresh
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
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} mins ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
      }
    } catch (error) {
      return 'Unknown time';
    }
  };

  // Get flag count from incident data (you might need to adjust this based on your API response structure)
  const getFlagCount = (incident) => {
    return incident.flagCount || incident.flags?.length || 0;
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
        <Text style={styles.headerText}>Relief - Admin</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search incidents..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Loading state for initial load */}
        {isLoading && incidents.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Loading incidents...</Text>
          </View>
        ) : incidents.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-outline" size={48} color="#ccc" />
            <Text style={styles.noDataText}>
              {searchText ? `No incidents found for "${searchText}"` : 'No incidents found'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchIncidents(0, true)}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {incidents.map((incident) => {
              const flagCount = getFlagCount(incident);

              return (
                <TouchableOpacity
                  key={incident.incidentId || incident.id}
                  onPress={() =>
                    navigation.navigate("ReportDetail", {
                      report: {
                        ...incident,
                        id: incident.incidentId || incident.id,
                        title: incident.title,
                        location: `${incident.latitude}, ${incident.longitude}`, // You might want to reverse geocode this
                        urgency: incident.urgencyLevel?.toLowerCase() || 'medium',
                        description: incident.description,
                        time: formatDate(incident.incidentDate),
                        flagCount: flagCount
                      }
                    })
                  }
                >
                  <View
                    style={[
                      styles.contentCard,
                      flagCount > 5 && styles.flaggedCard,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {incident.title || 'Incident Report'}
                      </Text>
                      <Text style={styles.cardTime}>
                        {formatDate(incident.incidentDate)}
                      </Text>
                    </View>

                    <View style={styles.locationRow}>
                      <View style={styles.locationContainer}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color="#666"
                          style={styles.locationIcon}
                        />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {/* You might want to implement reverse geocoding here */}
                          {incident.address || `${incident.latitude?.toFixed(4)}, ${incident.longitude?.toFixed(4)}` || 'Location not available'}
                        </Text>
                      </View>
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

                    <Text style={styles.cardContent} numberOfLines={3}>
                      {incident.description || 'No description available.'}
                    </Text>

                    {/* Organization Type */}
                    {incident.organizationType && (
                      <View style={styles.organizationContainer}>
                        <Ionicons name="business-outline" size={14} color="#666" />
                        <Text style={styles.organizationText}>{incident.organizationType}</Text>
                      </View>
                    )}

                    {/* Flag Count Display */}
                    <View style={styles.flagContainer}>
                      <Ionicons
                        name="flag"
                        size={16}
                        color="#dc3545"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[
                        styles.flagText,
                        flagCount > 5 && styles.highFlagText
                      ]}>
                        {flagCount} flag{flagCount !== 1 ? "s" : ""}
                        {flagCount > 5 ? " — marked as suspicious" : ""}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 10,
  },
  contentContainer: {
    padding: 16,
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
    textAlign: 'center',
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
  flaggedCard: {
    backgroundColor: "#ffe6e6",
    borderColor: "#ff4d4d",
    borderWidth: 2,
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
    marginRight: 8,
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
    flex: 1,
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
    marginBottom: 12,
  },
  organizationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: '500',
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagText: {
    color: "#c0392b",
    fontWeight: "600",
    fontSize: 13,
  },
  highFlagText: {
    color: "#e74c3c",
    fontWeight: "700",
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