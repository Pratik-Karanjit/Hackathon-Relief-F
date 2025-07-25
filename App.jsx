import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginPage from "./components/Auth/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./components/Users/HomePage";
import RegisterPage from "./components/Auth/RegisterPage";
import UserBottomTabNavigator from "./components/Users/UserBottomTabNavigator";
import AdminBottomTabNavigator from "./components/Admin/AdminBottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  const userRole = "admin";
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
