import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { registerForPushNotificationsAsync } from '../../utils/notifications.js';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const setupNotifications = async () => {
        try {
            const token = await registerForPushNotificationsAsync();
            console.log("📲 FCM Token:", token);

            // Store the FCM token in AsyncStorage
            if (token) {
                await AsyncStorage.setItem('fcmToken', token);
                console.log('FCM Token stored successfully');

                // Get userId from AsyncStorage
                try {
                    const userId = await AsyncStorage.getItem('userId');
                    console.log('Retrieved userId from AsyncStorage:', userId);

                    if (userId) {
                        // Convert to integer and ensure it's a valid number
                        const userIdAsNumber = parseInt(userId, 10);

                        if (isNaN(userIdAsNumber)) {
                            console.error('Invalid userId format:', userId);
                            return;
                        }

                        const fcmData = {
                            id: userIdAsNumber, // Send as integer, not Number()
                            fcmToken: token
                        };

                        console.log('Sending FCM data to backend:', fcmData);
                        console.log('UserId type:', typeof fcmData.id, 'Value:', fcmData.id);

                        await api.post('/fcm/sendToken', fcmData);
                        console.log('FCM Token sent to backend successfully');
                    } else {
                        console.warn('No userId found in AsyncStorage, skipping FCM token backend update');
                    }
                } catch (error) {
                    console.error('Failed to send FCM token to backend:', error);
                    // Don't fail the login process if FCM token update fails
                }
            }

            return token;
        } catch (error) {
            console.error("❌ Failed to get FCM Token:", error);
            return null;
        }
    };

    const handleLogin = async () => {
        // Validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const loginData = {
                emailOrContact: email.trim().toLowerCase(),
                password: password
            };

            console.log('Sending login data:', { emailOrContact: loginData.emailOrContact, password: '[HIDDEN]' });

            // Use the api interceptor - no need to specify baseURL
            const response = await api.post('/user/login', loginData);

            console.log('Login response:', response.data);

            if (response.status === 200 || response.status === 201) {
                const userData = response.data;

                try {
                    // Store user data in AsyncStorage
                    if (userData.token) {
                        await AsyncStorage.setItem('userToken', userData.token);
                        console.log('Token stored successfully');
                    }

                    if (userData.user) {
                        await AsyncStorage.setItem('userData', JSON.stringify(userData.user));
                        console.log('User data stored successfully');
                    }

                    // Store userId separately for easy access
                    const userId = userData.user?.id ||
                        userData.user?.userId ||
                        userData.userId ||
                        userData.id;

                    if (userId) {
                        await AsyncStorage.setItem('userId', userId.toString());
                        console.log('UserId stored successfully:', userId);
                    }

                    // Store additional data if available
                    if (userData.refreshToken) {
                        await AsyncStorage.setItem('refreshToken', userData.refreshToken);
                    }

                    if (userData.role) {
                        await AsyncStorage.setItem('role', userData.role);
                    }

                    // Store the entire response if needed
                    await AsyncStorage.setItem('loginResponse', JSON.stringify(userData));

                    console.log('All user data stored in AsyncStorage');

                    // Setup FCM notifications after successful login and data storage
                    console.log('Setting up FCM notifications...');
                    await setupNotifications();

                    Alert.alert(
                        'Success',
                        'Login successful!',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigateToHome(userData.role || 'user')
                            }
                        ]
                    );

                    // Clear form
                    setEmail('');
                    setPassword('');

                } catch (storageError) {
                    console.error('AsyncStorage error:', storageError);
                    Alert.alert('Warning', 'Login successful but failed to save session data');

                    // Still try to setup notifications even if storage fails
                    await setupNotifications();
                    navigateToHome(userData.role || 'user');
                }
            }

        } catch (error) {
            console.error('Login error:', error);

            let errorMessage = 'Login failed. Please try again.';

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data.message || 'Invalid email or password format.';
                } else if (status === 401) {
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                } else if (status === 403) {
                    errorMessage = 'Account is blocked or inactive. Please contact support.';
                } else if (status === 404) {
                    errorMessage = 'Account not found. Please check your email or sign up.';
                } else if (status === 422) {
                    errorMessage = data.message || 'Please check your input data.';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = data.message || `Login failed (${status})`;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            }

            Alert.alert('Login Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    const navigateToHome = (role) => {
        if (role === 'ADMIN') {
            navigation.navigate('AdminTabs');
        } else {
            navigation.navigate('UserTabs');
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isLoading ? '#f5f5f5' : '#fff' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.card}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>LOGO</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        disabled={isLoading}
                    >
                        <Text style={[styles.forgotPasswordText, isLoading && styles.disabledText]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={navigateToRegister}
                            disabled={isLoading}
                        >
                            <Text style={[styles.signupLink, isLoading && styles.disabledText]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderRadius: 12,
        padding: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#007bff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        alignItems: 'stretch',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    loginButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#6c757d',
        opacity: 0.6,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        alignItems: 'center',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#007bff',
        fontSize: 14,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#007bff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#6c757d',
        opacity: 0.6,
    },
});