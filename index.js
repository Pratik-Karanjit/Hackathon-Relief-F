import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './utils/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);
  
  // Store the notification data for when the app becomes active
  if (remoteMessage.data?.incidentId) {
    await AsyncStorage.setItem('pendingNotificationNavigation', JSON.stringify({
      incidentId: remoteMessage.data.incidentId,
      timestamp: Date.now()
    }));
  }
});

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
  console.log('📩 Foreground Message:', remoteMessage);
  
  // Handle immediate navigation for foreground messages
  if (remoteMessage.data?.incidentId && navigationRef.isReady()) {
    handleNotificationNavigation(remoteMessage.data.incidentId);
  }
});

// Handle notification opened app (when app is in background/quit)
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('📩 Notification opened app from background state:', remoteMessage);
  
  if (remoteMessage.data?.incidentId) {
    // Navigate to incident details
    setTimeout(() => {
      handleNotificationNavigation(remoteMessage.data.incidentId);
    }, 1000); // Small delay to ensure navigation is ready
  }
});

// Check whether an initial notification is available (when app was quit)
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('📩 Notification caused app to open from quit state:', remoteMessage);
      
      if (remoteMessage.data?.incidentId) {
        // Store for later navigation after app loads
        AsyncStorage.setItem('initialNotificationNavigation', JSON.stringify({
          incidentId: remoteMessage.data.incidentId,
          timestamp: Date.now()
        }));
      }
    }
  });

function handleNotificationNavigation(incidentId) {
  if (navigationRef.isReady()) {
    try {
      // Navigate to UserViewDetails with the incident ID
      navigationRef.navigate('UserTabs', {
        screen: 'Home',
        params: {
          screen: 'UserViewDetails',
          params: {
            incidentId: incidentId,
            fromNotification: true
          }
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: try direct navigation if nested navigation fails
      navigationRef.navigate('UserViewDetails', {
        incidentId: incidentId,
        fromNotification: true
      });
    }
  }
}

AppRegistry.registerComponent('main', () => App);