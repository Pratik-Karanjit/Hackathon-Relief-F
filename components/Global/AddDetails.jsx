import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Constants } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddDetails({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [date, setDate] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [images, setImages] = useState([]);
    const [locationType, setLocationType] = useState('current');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const handleLocationChange = async (type) => {
        setLocationType(type);
        if (type === 'current') {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setCurrentLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.fullHeight}>
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
                        />
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.mainTitle}>Briefly describe the incident</Text>

                    <TextInput
                        style={styles.titleInput}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />

                    <View style={styles.rowContainer}>
                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={styles.label}>Time</Text>
                            <Text>{date.toLocaleTimeString()}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.dateTimeButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.label}>Date</Text>
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.urgencyWrapper}>
                        <Text style={styles.label}>Urgency</Text>
                        <Picker
                            selectedValue={urgency}
                            style={styles.picker}
                            onValueChange={(itemValue) => setUrgency(itemValue)}
                        >
                            <Picker.Item label="High" value="High" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="Low" value="Low" />
                        </Picker>
                    </View>

                    <View>
                        <View style={styles.imageHeader}>
                            <Text style={styles.label}>Add Images</Text>
                            <TouchableOpacity onPress={handleImagePick}>
                                <MaterialIcons name="add-circle" size={24} color="#007bff" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView horizontal style={styles.imageList}>
                            {images.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image
                                source={{ uri }}
                                style={styles.thumbnail}
                                />
                                <TouchableOpacity
                                style={styles.removeIcon}
                                onPress={() => {
                                    const updatedImages = images.filter((_, i) => i !== index);
                                    setImages(updatedImages);
                                }}
                                >
                                <Ionicons name="close-circle" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.locationSection}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity 
                                style={styles.radioButton}
                                onPress={() => handleLocationChange('current')}
                            >
                                <View style={[
                                    styles.radio,
                                    locationType === 'current' && styles.radioSelected
                                ]} />
                                <Text>Set my Location</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.radioButton}
                                onPress={() => handleLocationChange('map')}
                            >
                                <View style={[
                                    styles.radio,
                                    locationType === 'map' && styles.radioSelected
                                ]} />
                                <Text>Pin on Map</Text>
                            </TouchableOpacity>
                        </View>

                        {locationType === 'map' && (
                            <MapView
                                style={styles.map}
                                provider="google"
                                apiKey={Constants.GOOGLE_MAPS_API_KEY}
                                initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
                            >
                                {selectedLocation && (
                                    <Marker coordinate={selectedLocation} />
                                )}
                            </MapView>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.postButton]}
                            onPress={() => {/* Handle post */}}
                        >
                            <Text style={styles.postButtonText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showTimePicker && (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    fullHeight: {
        flexGrow: 1,
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
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    formContainer: {
        flex: 1,
        padding: 35,
        paddingTop: 16,
        paddingBottom: 40,
        width: '100%',
    },
    dateTimeButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    titleInput: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    urgencyWrapper: {
        marginBottom: 16,
    },
    descriptionInput: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        height: 120,
        borderRadius: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    picker: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginTop: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    imageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageList: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 8,
        paddingTop: 6,
        paddingRight: 6,
    },
    removeIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    zIndex: 1,
    },
    thumbnail: {
        width: 80,
        height: 80,
        marginRight: 8,
        borderRadius: 4,
    },
    locationSection: {
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007bff',
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: '#007bff',
    },
    map: {
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007bff',
        marginRight: 8,
    },
    postButton: {
        backgroundColor: '#007bff',
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '500',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
