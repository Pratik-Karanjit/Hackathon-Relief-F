import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./components/Users/HomePage";
import RegisterPage from "./components/Auth/RegisterPage";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator";
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { registerForPushNotificationsAsync } from './utils/notifications';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const userRole = "user";
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
        screenOptions={{ headerShown: false }}
      >
        {/* <Stack.Screen name="Login" component={LoginPage} /> */}
        {/* <Stack.Screen name="Register" component={RegisterPage} /> */}
        {/* <Stack.Screen name="Home" component={BottomTabNavigator} /> */}

        {userRole === "admin" ? (
          <Stack.Screen name="AdminTabs" component={AdminBottomTabNavigator} />
        ) : (
          <Stack.Screen name="UserTabs" component={UserBottomTabNavigator} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
