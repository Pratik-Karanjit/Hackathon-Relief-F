// utils/notifications.js
import messaging from '@react-native-firebase/messaging';

export async function registerForPushNotificationsAsync() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    throw new Error('Permission not granted for FCM push notifications');
  }

  const fcmToken = await messaging().getToken();

  if (!fcmToken) {
    throw new Error('Failed to get FCM token');
  }

  console.log('📲 FCM Token:', fcmToken);
  return fcmToken;
}
