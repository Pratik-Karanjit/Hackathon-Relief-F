import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AdminAddOrganization() {
    const [formData, setFormData] = useState({
        image: null,
        username: '',
        organizationName: '',
        contact: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        orgType: ''
    });

    const [errors, setErrors] = useState({});

    const orgTypes = [
        { label: 'Select Organization Type', value: '' },
        { label: 'Police Department', value: 'POLICE' },
        { label: 'Ambulance Service', value: 'AMBULANCE' },
        { label: 'Fire Department', value: 'FIRE' },
        { label: 'Veterinary Service', value: 'VET' }
    ];

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData({ ...formData, image: result.assets[0].uri });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.image) newErrors.image = 'Organization image is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
        if (!formData.contact) newErrors.contact = 'Contact number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.orgType) newErrors.orgType = 'Organization type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Form submitted:', formData);
            // Add your API call here
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add Organization</Text>
            </View>

            <View style={styles.content}>
                {/* Profile Image Picker */}
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                    {formData.image ? (
                        <Image source={{ uri: formData.image }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera" size={40} color="#666" />
                            <Text style={styles.imagePlaceholderText}>Add Logo</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.username}
                        onChangeText={(text) => setFormData({ ...formData, username: text })}
                        placeholder="Enter username"
                    />
                    {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Organization Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.organizationName}
                        onChangeText={(text) => setFormData({ ...formData, organizationName: text })}
                        placeholder="Enter organization name"
                    />
                    {errors.organizationName && <Text style={styles.errorText}>{errors.organizationName}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.contact}
                        onChangeText={(text) => setFormData({ ...formData, contact: text })}
                        placeholder="Enter contact number"
                        keyboardType="phone-pad"
                    />
                    {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        placeholder="Enter address"
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        placeholder="Enter password"
                        secureTextEntry
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                        placeholder="Confirm password"
                        secureTextEntry
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Organization Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.orgType}
                            onValueChange={(value) => setFormData({ ...formData, orgType: value })}
                            style={styles.picker}
                        >
                            {orgTypes.map((type, index) => (
                                <Picker.Item key={index} label={type.label} value={type.value} />
                            ))}
                        </Picker>
                    </View>
                    {errors.orgType && <Text style={styles.errorText}>{errors.orgType}</Text>}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Register Organization</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#666',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});