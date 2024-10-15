import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Pressable,
    TextInput,
    ScrollView
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { rootURL } from '../config/baseApi';
import { readData } from '../data/DB';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fetchExamMode } from '../redux/reducers/examModeSlice';
import { Modal } from 'react-native-paper';

export default function Header({ navigation }) {
    const { width } = Dimensions.get('screen');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const dispatch = useDispatch();
    const { departments } = useSelector((state) => state.departments);
    const refRBSheet = useRef();
    const [visible, setVisible] = useState(false);
    const [textInputs, setTextInputs] = useState([{ id: 1, value: '', hasError: false }]);
    const [exam_loaddr, setExamLoader] = useState(false);
    const { courses } = useSelector((state) => state.courses);


    const [selectedCourses, setSelectedCourses] = useState([]);

    const toggleCourseSelection = (course_id) => {
        if (selectedCourses.includes(course_id)) {
            setSelectedCourses(selectedCourses.filter(id => id !== course_id)); // Unselect if already selected
        } else {
            setSelectedCourses([...selectedCourses, course_id]); // Select if not already selected
        }
    };


    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userInformation');
                const parsedData = JSON.parse(userData);
                setFullName(parsedData.fullName);
                setUsername(parsedData.username);
            } catch (error) {
               
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
        });
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${rootURL}notifications/get_notifications.php?username=${username}`);
                setNotifications(response.data.data);
                setUnreadCount(response.data.data.filter(n => !n.read).length);
            } catch (err) {
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [username]);

    const joinChallenge = async (file) => {
        const filename = file.split('/')[1];
        try {
            const response = await axios.get(`${rootURL}courses/read_challenge.php?filename=${filename}`);
            setShowNotifications(false);
            navigation.navigate('ExamMode', {
                package_id: 1,
                question_data: response.data,
                package_name: "Model Exam",
                tags: "",
            });
        } catch (err) {
            
        }
    };

    const renderNotification = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={{ color: '#222' }}>{item.message}</Text>
            {item.exam_code && <Pressable onPress={() => joinChallenge(item.exam_code)}><Text style={{ color: 'blue' }}>Click here to Join</Text></Pressable>}
        </View>
    );

    const addTextInput = () => {
        const updatedInputs = textInputs.map(input =>
            input.value.trim() === '' ? { ...input, hasError: true } : { ...input, hasError: false }
        );

        const hasEmptyInput = updatedInputs.some(input => input.hasError);
        if (!hasEmptyInput) {
            setTextInputs([...textInputs, { id: textInputs.length + 1, value: '', hasError: false }]);
        } else {
            setTextInputs(updatedInputs);
        }
    };

    const removeTextInput = (id) => {
        setTextInputs(textInputs.filter(input => input.id !== id));
    };

    const handleTextChange = (id, newValue) => {
        setTextInputs(textInputs.map(input =>
            input.id === id ? { ...input, value: newValue, hasError: newValue.trim() === '' } : input
        ));
    };

    const generateExamMode = async () => {
        setExamLoader(true)
        let responseMessage = 0
        try {
            const response = await fetch(`${rootURL}users/check_usernames.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(textInputs)
            });
           
            if (!response.ok) {
                setExamLoader(false)
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setTextInputs(result)

            result.forEach(item => {
                if (item.hasError) {
                    responseMessage++
                }
            });

            if (responseMessage <= 0) {
                readData('interestList').then((data) => {
                    const interestsArray = Object.keys(data).filter((key) => data[key] === "selected");
                    const userNames = textInputs.map(item => item.value);

                    dispatch(fetchExamMode({ interestsArray, userNames, selectedCourses })).then((response) => {
                        navigation.navigate('ExamMode', {
                            package_id: 1,
                            question_data: response.payload,
                            package_name: "Model Exam",
                            tags: "",
                        });

                        setVisible(false);
                        setExamLoader(false);
                    });
                });
            } else {
                setExamLoader(false);
            }
        } catch (error) {
            setExamLoader(false);
        }
        return responseMessage;
    };
    const renderCourseItem = (item) => (
        <TouchableOpacity key={item.course_id} onPress={() => toggleCourseSelection(item.course_id)}>
            <Card style={[styles.courseCard, selectedCourses.includes(item.course_id) ? styles.selectedCourseCard : null]}>
                <Text style={[styles.courseName, selectedCourses.includes(item.course_id) ? styles.selectedCourseName : null]}>
                    {item.course_name}
                </Text>
            </Card>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialCommunityIcons name="menu-open" size={24} color="#222" onPress={() => refRBSheet.current.open()} />
                <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
                    <Ionicons name="notifications-outline" size={moderateScale(24)} color="#222" />
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

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
                        <View style={{ width: "97%" }}>
                            <Text numberOfLines={4} style={{ color: '#fff', paddingRight: horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                        </View>
                    </View>
                </View>
            </Card>

            <RBSheet
                ref={refRBSheet}
                height={500}
                openDuration={250}
                customStyles={{
                    container: {
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: '#fff'
                    }
                }}
            >
                <View style={styles.bottomSheetContent}>
                    <Text style={styles.bottomSheetText}>Start an Exam Mode</Text>
                    <View style={{ height: verticalScale(50), margin:verticalScale(10) }}>
                    <Text style={{ color: '#222',  alignSelf: 'center', alignContent: 'center', fontSize: moderateScale(13) }}>
                        Get a random set of questions and test your understanding. start by <Text style={{color:'#5E5CE6'}}>Selecting courses</Text>
                    </Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.horizontalCourseList}>
                            {courses.map((item) => renderCourseItem(item))}
                        </View>
                    </ScrollView>
                    <View style={{ height: verticalScale(30), margin:verticalScale(10) }}>
                 
                    </View>
                    {textInputs.map((input, index) => (
                        <View key={input.id} style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, input.hasError ? styles.errorInput : null]}
                                value={input.value}
                                placeholder={`Username ${input.id}`}
                                onChangeText={(newValue) => handleTextChange(input.id, newValue)}
                            />
                            <Pressable onPress={(textInputs.length <= 1 && index <= 0) ? null : () => removeTextInput(input.id)}>
                                <AntDesign name="delete" size={moderateScale(24)}
                                    color={(textInputs.length <= 1 && index <= 0) ? '#6a6a6a' : 'red'}

                                />
                            </Pressable>
                        </View>
                    ))}
                    <View>
                      
                    </View>
                    
                </View>
                {!exam_loaddr && <Pressable style={styles.addButton} onPress={addTextInput}>
                            <Text style={styles.addButtonText}>Invite more friend</Text>
                        </Pressable>}
                        {!exam_loaddr && <Pressable style={styles.generateButton} onPress={generateExamMode}>
                            <Text style={styles.generateButtonText}>Generate Exam</Text>
                        </Pressable>}
                        {exam_loaddr &&
                            <TouchableOpacity style={styles.getStartedButton2}>
                                <Text style={styles.buttonText}>Please wait, Exam is bieng generated</Text>
                            </TouchableOpacity>
                        }
            </RBSheet>
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
    buttonText: {
        color: '#fff',
        fontSize: verticalScale(16),
        fontWeight: 'bold',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    getStartedButton2: {
        backgroundColor: '#f7b2a6',
        height: verticalScale(50),
        // width:horizontalScale(30),
        justifyContent: 'center',
        borderRadius: moderateScale(7),
    },
    popoverTitle: {
        fontWeight: 'bold',
        marginBottom: moderateScale(10),
        color: '#222'
    },
    notificationItem: {
        paddingVertical: moderateScale(5),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    bottomSheetContent: {
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheetText: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight:'bold'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        marginRight: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    addButton: {
        backgroundColor: '#5E5CE6',
        // padding: 10,
        // borderRadius: 5,
        // marginTop: 10,
        
        height: verticalScale(50),
        justifyContent: 'center',
        borderRadius: moderateScale(7),
    },
    addButtonText: {
        color: '#fff',
        alignSelf:'center'
    },
    generateButton: {
        backgroundColor: '#FF6347',
        // padding: 10,
        // borderRadius: 5,
        // marginTop: 10,

        height: verticalScale(50),
        justifyContent: 'center',
        borderRadius: moderateScale(7),
        marginTop:verticalScale(10)
    },
    generateButtonText: {
        color: '#fff',
        alignSelf:'center'
    },





    selectedCourseName: {
        color: '#fff',
    },
    courseName: {
        color: '#333',
        fontSize: 14,
    },
    selectedCourseCard: {
        backgroundColor: '#FF6347',
    },
    horizontalCourseList: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    courseCard: {
        backgroundColor: '#f0f0f0',
        width: horizontalScale(150), 
        height: verticalScale(50),
        borderRadius: 8,
        marginHorizontal: 8, 
        justifyContent: 'center', 
        alignItems: 'center',  
    },
});
