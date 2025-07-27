import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomePage from "../Users/HomePage";
import NotificationPage from "../Global/NotificationPage";
import ProfilePage from "../Global/ProfilePage";
import OrgStackNavigator from "./OrgStackNavigator";

const Tab = createBottomTabNavigator();

export default function OrgBottomTabNavigator() {
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
            case "Notifications":
              iconName = focused ? "notifications" : "notifications-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 6,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={OrgStackNavigator} />
      <Tab.Screen name="Notifications" component={NotificationPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
