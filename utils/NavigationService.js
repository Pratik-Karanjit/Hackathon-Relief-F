import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function navigateToIncident(incidentId) {
  if (navigationRef.isReady()) {
    try {
      // Try nested navigation first
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
      console.error('Nested navigation failed, trying direct navigation:', error);
      // Fallback to direct navigation
      navigationRef.navigate('UserViewDetails', {
        incidentId: incidentId,
        fromNotification: true
      });
    }
  }
}