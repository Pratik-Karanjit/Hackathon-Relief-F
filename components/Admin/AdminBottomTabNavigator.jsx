import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import NotificationPage from "../Global/NotificationPage";
import ProfilePage from "../Global/ProfilePage";
import AdminStackNavigator from "./AdminStackNavigator";
import AdminAddOrganization from "./AdminAddOrganization";

const Tab = createBottomTabNavigator();

export default function AdminBottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Add Org":
              iconName = focused ? "business" : "business-outline";
              break;

            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 6, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={AdminStackNavigator} />
      <Tab.Screen name="Add Org" component={AdminAddOrganization} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}