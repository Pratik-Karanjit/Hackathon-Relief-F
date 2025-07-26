import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
// import HomePage from "./components/Global/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "./utils/notifications.js";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator.jsx";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator.jsx";
import StaticMap from "./components/Users/StaticMap.js";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log("📲 FCM Token:", token);
      } catch (error) {
        console.error("❌ Failed to get FCM Token:", error);
      }
    };

    setupNotifications();
  }, []);

  const userRole = "user";

  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map" component={UserBottomTabNavigator} />

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
