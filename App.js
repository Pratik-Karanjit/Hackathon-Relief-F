import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
// import HomePage from "./components/Global/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { registerForPushNotificationsAsync } from "./utils/notifications.js";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator.jsx";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator.jsx";
import StaticMap from "./components/Users/StaticMap.js";
import OfflinePage from "./components/Global/OfflinePage";
import { PaperProvider } from "react-native-paper";
import { theme } from "./MyThemes.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOffline, setIsOffline] = useState(false);
  const userRole = "admin";

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

  useEffect(() => {
    const checkOnline = async () => {
      try {
        const response = await fetch("https://www.google.com/favicon.ico", {
          method: "HEAD",
        });
        return response.ok;
      } catch {
        return false;
      }
    };

    const verify = async () => {
      const online = await checkOnline();
      setIsOffline(!online);
    };

    verify(); // run once immediately
    const interval = setInterval(verify, 5000); // repeat every 5s

    return () => clearInterval(interval); // cleanup
  }, []);

  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {userRole === "admin" ? (
            <Stack.Screen
              name="AdminTabs"
              component={AdminBottomTabNavigator}
            />
          ) : (
            <Stack.Screen name="UserTabs" component={UserBottomTabNavigator} />
          )}
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
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
