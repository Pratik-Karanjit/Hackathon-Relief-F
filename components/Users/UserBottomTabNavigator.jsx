import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomePage from "./HomePage";
import NotificationPage from "../Global/NotificationPage";
// import AddScreen from "./AddScreen";
import ProfilePage from "../Global/ProfilePage";
import UserStackNavigator from "./UserStackNavigator";

const Tab = createBottomTabNavigator();

export default function UserBottomTabNavigator() {
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
            case "Add":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Notifications":
              iconName = focused ? "notifications" : "notifications-outline";
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
      <Tab.Screen name="Home" component={UserStackNavigator} />
      {/* <Tab.Screen name="Add" component={AddScreen} /> */}
      <Tab.Screen name="Notifications" component={NotificationPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
