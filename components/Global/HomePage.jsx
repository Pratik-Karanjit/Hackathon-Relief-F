import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Dummy screens (replace later)
function HomeScreen() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Home</Text></View>;
}
function AddScreen() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Add</Text></View>;
}
function ProfileScreen() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Profile</Text></View>;
}
function NotificationScreen() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Notifications</Text></View>;
}

const Tab = createBottomTabNavigator();

export default function HomePage() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Add':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        case 'Notifications':
                            iconName = focused ? 'notifications' : 'notifications-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 6,
                    height: 60,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Add" component={AddScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
