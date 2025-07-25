import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminHomePage from "./AdminHomePage";
import ReportDetailScreen from "./ReportDetailScreen";
import CreateFundsPage from "./CreateFundsPage";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminHomePage} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="CreateFundsPage" component={CreateFundsPage} />
    </Stack.Navigator>
  );
}
