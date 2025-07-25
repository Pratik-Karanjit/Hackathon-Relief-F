import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './components/Auth/LoginPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './components/Global/HomePage';
import RegisterPage from './components/Auth/RegisterPage';
import AddDetails from './components/Global/AddDetails';
import ViewDetails from './components/Global/ViewDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {/* <Stack.Screen name="Login" component={LoginPage} /> */}
        {/* <Stack.Screen name="Register" component={RegisterPage} /> */}
        <Stack.Screen name="Home" component={HomePage} />
         <Stack.Screen name="ViewDetails" component={ViewDetails} />
        {/* <Stack.Screen name="AddDetails" component={AddDetails} /> */}
        {/* <Stack.Screen name="ViewDetails" component={ViewDetails} /> */}

      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
