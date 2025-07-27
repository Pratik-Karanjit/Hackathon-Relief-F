import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../Users/HomePage";
import UserViewDetails from "../Users/UserViewDetails";

const Stack = createNativeStackNavigator();

export default function OrgStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgHome" component={HomePage} />
      <Stack.Screen name="UserViewDetails" component={UserViewDetails} />
    </Stack.Navigator>
  );
}
