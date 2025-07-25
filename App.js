import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import HomePage from './components/Global/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { registerForPushNotificationsAsync } from './utils/notifications.js';

const Stack = createNativeStackNavigator();

// Set up how notifications behave when received in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

useEffect(() => {
  const setupNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      console.log('📲 FCM Token:', token);
    } catch (error) {
      console.error('❌ Failed to get FCM Token:', error);
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📥 Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification Clicked:', response);
    });
  };

  setupNotifications();

  return () => {
    notificationListener.current?.remove();
    responseListener.current?.remove();
  };
}, []);



  return (
    <NavigationContainer>
<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>

   <Stack.Screen name="Login" component={LoginPage} />

        <Stack.Screen name="Home" component={HomePage} />
        {/* <Stack.Screen name="Register" component={RegisterPage} /> */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
