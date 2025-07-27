import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
// import HomePage from "./components/Global/HomePage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator.jsx";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator.jsx";
import StaticMap from "./components/Users/StaticMap.js";
import OfflinePage from "./components/Global/OfflinePage";
import { PaperProvider } from "react-native-paper";
import { theme } from "./MyThemes.js";
import { navigationRef } from "./utils/NavigationService.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
    checkForPendingNotifications();
  }, []);

   const checkForPendingNotifications = async () => {
    try {
      // Check for initial notification (app was quit)
      const initialNotification = await AsyncStorage.getItem('initialNotificationNavigation');
      if (initialNotification) {
        const { incidentId, timestamp } = JSON.parse(initialNotification);
        
        // Only navigate if notification is recent (within 5 minutes)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setTimeout(() => {
            if (navigationRef.isReady()) {
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
            }
          }, 2000); // Wait for navigation to be fully ready
        }
         await AsyncStorage.removeItem('initialNotificationNavigation');
      }
         const pendingNotification = await AsyncStorage.getItem('pendingNotificationNavigation');
      if (pendingNotification) {
        const { incidentId, timestamp } = JSON.parse(pendingNotification);
        
        // Only navigate if notification is recent
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setTimeout(() => {
            if (navigationRef.isReady()) {
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
            }
          }, 1000);
        }
        
        // Clear the stored notification
        await AsyncStorage.removeItem('pendingNotificationNavigation');
      }
    } catch (error) {
      console.error('Error checking pending notifications:', error);
    }
  };

  // const userRole = "user";

  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <PaperProvider theme={theme}>
       <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
<Stack.Screen name="Login" component={LoginPage} /> 
          <Stack.Screen name="Register" component={RegisterPage} /> 
          {/* {userRole === "admin" ? ( */}
            <Stack.Screen
              name="AdminTabs"
              component={AdminBottomTabNavigator}
            />
          {/* ) : ( */}
            <Stack.Screen name="UserTabs" component={UserBottomTabNavigator} />
          {/* )} */}
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