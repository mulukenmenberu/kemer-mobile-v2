import React, { useState, useEffect } from 'react';
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    Pressable
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import Axios for making the API request
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { baseURL, rootURL } from '../config/baseApi';

export default function Header({ showModal, navigation }) {
    const { width } = Dimensions.get('screen');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [allInterests, setAllInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [showNotifications, setShowNotifications] = useState(false); // State to control popover visibility
    const [notifications, setNotifications] = useState([]); // Notifications from API
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState(null); // State for error

    const dispatch = useDispatch();
    const { departments = [], loading: departmentsLoading, error: departmentsError } = useSelector((state) => state.departments);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userInformation') || {};
                const userDataa = JSON.parse(userData);
                // console.log(userData)
                setFullName(userDataa.fullName);
                setUsername(userDataa.username);
            } catch (error) {
                // console.error('Failed to fetch user data', error);
            }
        };

        getUserData();
    }, []);

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected');
            setSelectedInterests(interestsArray);
            setAllInterests(Object.keys(data));
            setRefresh(false);
        });
    }, [refresh]);

    // Fetch notifications from the API
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(`${rootURL}notifications/get_notifications.php?username=${username}`);
                setNotifications(response.data.data); // Assuming the API response contains a "notifications" array
                if(!response.data.data || response.data.data.length<=0){
                    setError('No notifications found')
                }
            } catch (err) {
                setError('Failed to fetch notifications');
                console.log(err)
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchNotifications();
    }, [username]);

    const joinChallenge = async (file) => {
        const filename = file.split('/')[1]
        try {
            const response = await axios.get(`${rootURL}courses/read_challenge.php?filename=${filename}`);
            setShowNotifications(false)
            navigation.navigate('ExamMode', {
                package_id: 1,
                question_data: response.data,
                package_name: "Model Exam",
                tags: "",
            })
            // setNotifications(response.data.data); // Assuming the API response contains a "notifications" array
        } catch (err) {
            // setError('Failed to fetch notifications');

        } finally {
            // setLoading(false); // Stop loading
        }

        /*navigation.navigate('ExamMode', {
            package_id: 1,
            question_data: response.payload,
            package_name: "Model Exam",
            tags: "",
        })*/
    }
    // Render notification item
    const renderNotification = ({ item }) => (

        <View style={styles.notificationItem} >
            <Text style={{color:'#222'}}>{item.message}</Text>
            {item.exam_code && <Pressable onPress={() => joinChallenge(item.exam_code)}><Text style={{ color: 'blue' }}>Click here to Join</Text></Pressable>}
        </View>
    );

    return (
        <>
            <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialCommunityIcons name="menu-open" size={24} color="#222" onPress={showModal} />
                <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
                    <Ionicons name="notifications-outline" size={moderateScale(24)} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Notification Popover */}
            {showNotifications && (
                <View style={styles.popover}>
                    <Text style={styles.popoverTitle}>Notifications</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <Text style={{ color: 'red' }}>{error}</Text>
                    ) : (
                        <FlatList
                            data={notifications}
                            renderItem={renderNotification}
                            keyExtractor={(item) => item.id}
                        />
                    )}
                </View>
            )}

            <Card
                style={{
                    marginTop: verticalScale(8),
                    marginBottom: verticalScale(20),
                    alignSelf: 'center',
                    height: verticalScale(80),
                    width: width - 20,
                    backgroundColor: '#5E5CE6',
                    justifyContent: 'center'
                }}
            >
                <View style={{ marginLeft: horizontalScale(10), marginRight: verticalScale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View>
                        <Image
                            source={require('../assets/avatar.png')}
                            style={{ width: horizontalScale(50), height: verticalScale(50), borderRadius: moderateScale(50 / 2) }}
                        />
                    </View>
                    <View style={{ marginLeft: horizontalScale(20) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome {fullName}</Text>
                            <AntDesign name="edit" size={moderateScale(24)} color="white" />
                        </View>
                        <Text style={{ color: '#fff', paddingRight: horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                    </View>
                </View>
            </Card>
        </>
    );
}

const styles = StyleSheet.create({
    popover: {
        position: 'absolute',
        top: moderateScale(50),
        right: moderateScale(10),
        backgroundColor: 'white',
        padding: moderateScale(10),
        borderRadius: moderateScale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        zIndex: 1000,
        width: horizontalScale(270)
    },
    popoverTitle: {
        fontWeight: 'bold',
        marginBottom: moderateScale(10),
        color:'#222'
    },
    notificationItem: {
        paddingVertical: moderateScale(5),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    }
});
