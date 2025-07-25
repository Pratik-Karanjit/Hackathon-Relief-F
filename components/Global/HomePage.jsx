import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddDetails from './AddDetails';

// Updated Home Screen with content
function HomeScreen() {
    const [searchText, setSearchText] = useState('');

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header with Logo and Search */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>LOGO</Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {/* Content Cards */}
            <View style={styles.contentContainer}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={styles.contentCard}>
                        <Text style={styles.cardTitle}>Card Title {item}</Text>
                        <Text style={styles.cardContent}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Text>
                        <Text style={styles.cardFooter}>Posted 2 hours ago</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

// Keep other screens simple for now
function AddScreen() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><AddDetails/></View>;
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoContainer: {
        marginRight: 12,
    },
    logo: {
        width: 40,
        height: 40,
        backgroundColor: '#007bff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    contentContainer: {
        padding: 16,
    },
    contentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    cardContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
});