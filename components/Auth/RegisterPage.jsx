import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
} from 'react-native';
import api from '../../services/api'; // Import the api interceptor

export default function RegisterPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // Validation
        if (!firstName || !lastName || !email || !contact || !address || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (contact.length < 10) {
            Alert.alert('Error', 'Please enter a valid contact number');
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                username,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                contact: contact.trim(),
                address: address.trim(),
                password: password,
                confirmPassword: confirmPassword
            };

            // Use the api interceptor - no need to specify baseURL
            const response = await api.post('/user/signup/user', userData);

            if (response.status === 200 || response.status === 201) {
                Alert.alert(
                    'Success',
                    'Account created successfully! Please login.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToLogin()
                        }
                    ]
                );

                // Clear form
                setUsername('');
                setFirstName('');
                setLastName('');
                setEmail('');
                setContact('');
                setAddress('');
                setPassword('');
                setConfirmPassword('');
            }

        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = data.message || 'Invalid input data. Please check your information.';
                } else if (status === 409) {
                    errorMessage = 'An account with this email already exists.';
                } else if (status === 422) {
                    errorMessage = data.message || 'Please check your input data.';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = data.message || `Registration failed (${status})`;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            }

            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    // ... rest of your component JSX remains the same
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoPlaceholder}>
                                <Text style={styles.logoText}>LOGO</Text>
                            </View>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Sign up to get started</Text>
                            <TextInput
                                style={[styles.input, styles.usernameInput]}
                                placeholder="User Name"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="words"
                                editable={!isLoading}
                            />

                            <View style={styles.nameContainer}>
                                <TextInput
                                    style={[styles.input, styles.nameInput]}
                                    placeholder="First Name"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    autoCapitalize="words"
                                    editable={!isLoading}
                                />
                                <View style={styles.inputSpacing} />
                                <TextInput
                                    style={[styles.input, styles.nameInput]}
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="words"
                                    editable={!isLoading}
                                />
                            </View>

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
                                placeholder="Contact Number"
                                value={contact}
                                onChangeText={setContact}
                                keyboardType="phone-pad"
                                editable={!isLoading}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={address}
                                onChangeText={setAddress}
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

                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                editable={!isLoading}
                            />

                            <TouchableOpacity
                                style={[styles.registerButton, isLoading && styles.disabledButton]}
                                onPress={handleRegister}
                                disabled={isLoading}
                            >
                                <Text style={styles.registerButtonText}>
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <TouchableOpacity
                                    onPress={navigateToLogin}
                                    disabled={isLoading}
                                >
                                    <Text style={[styles.loginLink, isLoading && styles.disabledText]}>
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 20 : 0,
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderRadius: 12,
        padding: Platform.OS === 'ios' ? 30 : 50,
        paddingHorizontal: 20,
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
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    usernameInput: {
        flex: 1,
        marginBottom: 14,
    },
    nameInput: {
        flex: 1,
        marginBottom: 0,
    },
    inputSpacing: {
        width: 10,
    },
    addressInput: {
        height: 100,
        paddingTop: 12,
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
        paddingVertical: Platform.OS === 'ios' ? 12 : 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    registerButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#007bff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});