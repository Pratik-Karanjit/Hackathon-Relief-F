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

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

  const userRole = "user";

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsOffline(!state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);

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