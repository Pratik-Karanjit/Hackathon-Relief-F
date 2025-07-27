import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "../User/HomePage"; // reuse the same HomePage
import OrgViewDetails from "./OrgViewDetails"; // a separate screen for org details

const Stack = createNativeStackNavigator();

export default function OrgStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgHome" component={HomePage} />
      <Stack.Screen name="OrgViewDetails" component={OrgViewDetails} />
    </Stack.Navigator>
  );
}
