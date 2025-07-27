import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserViewDetails from "../Users/UserViewDetails";
import HomeScreen from "../Users/HomePage";

const Stack = createNativeStackNavigator();

export default function OrgStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgHome" component={HomeScreen} />
      <Stack.Screen name="OrgViewDetails" component={UserViewDetails} />
    </Stack.Navigator>
  );
}
