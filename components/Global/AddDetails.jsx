import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Constants } from '../../constants';

export default function AddDetails({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [images, setImages] = useState([]);
    const [locationType, setLocationType] = useState('current');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Time picker modal
    const [showTimePicker, setShowTimePicker] = useState(false);

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
        <ScrollView style={styles.container}>
            <Text style={styles.mainTitle}>Briefly describe the incident</Text>

            <View style={styles.formContainer}>
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
                    <View style={styles.urgencyContainer}>
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

                    <TouchableOpacity 
                        style={styles.timeButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text style={styles.label}>Time</Text>
                        <Text>{date.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageSection}>
                    <View style={styles.imageHeader}>
                        <Text style={styles.label}>Add Images</Text>
                        <TouchableOpacity onPress={handleImagePick}>
                            <MaterialIcons name="add-circle" size={24} color="#007bff" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView horizontal style={styles.imageList}>
                        {images.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={styles.thumbnail}
                            />
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

            {/* Date Time Picker Modal */}
            <Modal
                visible={showTimePicker}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <DateTimePicker
                            value={date}
                            mode="datetime"
                            onChange={(event, selectedDate) => {
                                setDate(selectedDate || date);
                            }}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowTimePicker(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    formContainer: {
        flex: 1,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        height: 120,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    urgencyContainer: {
        flex: 1,
        marginRight: 8,
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    timeButton: {
        flex: 1,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    imageSection: {
        marginBottom: 16,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});