import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./HomePage";
import UserViewDetails from "./UserViewDetails";

const Stack = createNativeStackNavigator();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserHome" component={HomePage} />
      <Stack.Screen name="UserViewDetails" component={UserViewDetails} />
    </Stack.Navigator>
  );
}
