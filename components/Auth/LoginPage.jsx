import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        Alert.alert('Success', 'Login functionality to be implemented');
    };

    const navigateToRegister = () => {
        Alert.alert('Info', 'Navigate to Register page');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
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
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={navigateToRegister}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
});