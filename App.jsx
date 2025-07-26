import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from '@react-native-community/netinfo';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import HomePage from "./components/Users/HomePage";
import RegisterPage from "./components/Auth/RegisterPage";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator";
import OfflinePage from './components/Global/OfflinePage';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    accent: '#28a745',
    error: '#dc3545',
    background: '#f0f2f5',
    surface: '#ffffff',
  },
  roundness: 8,
};

export default function App() {
  const [isOffline, setIsOffline] = useState(false);
  const userRole = "user";

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />

          {userRole === "admin" ? (
            <Stack.Screen name="AdminTabs" component={AdminBottomTabNavigator} />
          ) : (
            <Stack.Screen name="UserTabs" component={UserBottomTabNavigator} />
          )}
        </Stack.Navigator>
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