import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setIsLoading(true);
      }
      setError(null);

      console.log('Fetching notifications...');

      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please login again.');
        setIsLoading(false);
        return;
      }

      console.log('Fetching notifications for userId:', userId);

      // Make API call using the existing interceptor
      const response = await api.get(`/notifications/me/${userId}`);


      if (response.status === 200) {
        let notificationData = [];

        // Handle different response structures
        if (response.data.success && response.data.data) {
          notificationData = response.data.data;
        } else if (response.data.data) {
          notificationData = response.data.data;
        } else if (Array.isArray(response.data)) {
          notificationData = response.data;
        } else {
          notificationData = response.data.notifications || [];
        }

        console.log('Processed notifications:', notificationData);

        // Transform data if needed to match UI expectations
        const transformedNotifications = notificationData.map(notification => ({
          id: notification.id || notification.notificationId || Math.random().toString(),
          title: notification.title || notification.subject || 'Notification',
          message: notification.message || notification.body || notification.content || 'No message available',
          time: formatTime(notification.createdAt || notification.timestamp || notification.time),
          type: notification.type || 'general',
          isRead: notification.isRead || notification.read || false,
          priority: notification.priority || 'normal',
          // Include original data for potential future use
          originalData: notification
        }));

        setNotifications(transformedNotifications);
      }

    } catch (error) {
      console.error('Error fetching notifications:', error);

      let errorMessage = 'Failed to load notifications. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'Please login again to access notifications.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to view notifications.';
        } else if (status === 404) {
          errorMessage = 'No notifications found.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setError(errorMessage);

      if (!isRefresh) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
      if (isRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} mins ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications(true);
  };

  const handleRetry = () => {
    fetchNotifications();
  };



  const markAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      console.log('hello world');
      // Make POST request to backend to mark notification as read
      const response = await api.post(`/notifications/read/${notificationId}`);

      console.log('Mark as read response:', response.data);

      if (response.status === 200) {
        // Update local state only after successful backend update
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );

        console.log('Notification marked as read successfully');
      }

    } catch (error) {
      console.error('Error marking notification as read:', error);

      let errorMessage = 'Failed to mark notification as read.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'Please login again to mark notifications as read.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to mark this notification as read.';
        } else if (status === 404) {
          errorMessage = 'Notification not found.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.card,
      !item.isRead && styles.unreadCard
    ]}>
      <View style={styles.cardHeader}>
        <Text style={[
          styles.title,
          !item.isRead && styles.unreadTitle
        ]}>
          {item.title}
        </Text>
        <View style={styles.headerRight}>
          {item.priority === 'high' && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>!</Text>
            </View>
          )}
          {!item.isRead && (
            <TouchableOpacity
              style={styles.markReadButton}
              onPress={() => markAsRead(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.markReadButtonText}>Mark as Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
  );

  const Header = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Header />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  // Error state (when no data and there's an error)
  if (error && notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📭</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListHeaderComponent={Header}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔔</Text>
          <Text style={styles.emptyText}>No notifications available</Text>
          <Text style={styles.emptySubText}>New notifications will appear here</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#007bff']}
          tintColor="#007bff"
        />
      }
    />
  );
}

// ...existing styles remain the same...
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#f0f2f5",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  errorEmoji: {
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
    marginHorizontal: -16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 4,
  },
  clearButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    backgroundColor: '#f8f9ff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: '#007bff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markReadButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  markReadButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
});