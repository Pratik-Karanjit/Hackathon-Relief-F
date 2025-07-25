import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import HomePage from './components/Global/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { registerForPushNotificationsAsync } from './utils/notifications';

const Stack = createNativeStackNavigator();

// Optional: How notifications are handled in foreground
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
    registerForPushNotificationsAsync().then(token => {
      console.log('📲 FCM Token:', token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📥 Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification Clicked:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {/* <Stack.Screen name="Login" component={LoginPage} /> */}
        {/* <Stack.Screen name="Register" component={RegisterPage} /> */}
        <Stack.Screen name="Home" component={HomePage} />
        {/* <Stack.Screen name="AddDetails" component={AddDetails} /> */}
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
