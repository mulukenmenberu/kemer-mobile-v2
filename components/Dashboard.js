// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetchCourses } from '../redux/reducers/coursesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionPackages } from '../redux/reducers/questionPackagesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';
import { readData } from '../data/DB';
import { TestAd } from '../TestAd';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import { fetchExamMode } from '../redux/reducers/examModeSlice';
import { rootURL } from '../config/baseApi';
export default function Dashboard({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [active, setActive] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [exam_loaddr, setExamLoader] = useState(false);

    const [fullName, setFullName] = useState('');
    const [emailorPhone, setEmailorPhone] = useState('');

    const [visible, setVisible] = useState(false);
    /** Modal Functions */
    const [textInputs, setTextInputs] = useState([{ id: 1, value: '', hasError: false }]);

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
    /* End of Modal functions*/

    const showModal = () => setVisible(true);
    const hideModal = () => {
        if (!exam_loaddr) {
            setVisible(false);
        }
    }
    const { examMode, loadingg, errorr } = useSelector((state) => state.examMode);

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
                    //   console.log(`User ${item.value} not found, set error state for this field.`);
                } else {
                    //   console.log(`User ${item.value} is valid.`);
                }
            });

            if (responseMessage <= 0) {
                setExamLoader(true)
                readData('interestList').then((data) => {

                    const interestsArray = Object.keys(data)
                        .filter((key) => data[key] === "selected")
                    // .join(' - '); 
                    const userNames = textInputs.map(item => item.value);

                    // console.log(userNames, interestsArray)
                    dispatch(fetchExamMode({ interestsArray, userNames })).then((response) => {
                        navigation.navigate('ExamMode', {
                            package_id: 1,
                            question_data: response.payload,
                            package_name: "Model Exam",
                            tags: "",
                        })

                        setVisible(false);
                        setExamLoader(false)

                    })
                });
            } else {
                setExamLoader(false)
            }
        } catch (error) {
            setExamLoader(false)
            //   console.error('There was a problem with the fetch operation:', error);
        }
        return responseMessage
    };

    const generateExamModeold = () => {
        const checkUname = sendDataCheckUname()
        console.log(checkUname, " jjj")
        if (checkUname <= 0) {
            setExamLoader(true)
            readData('interestList').then((data) => {

                const interestsArray = Object.keys(data)
                    .filter((key) => data[key] === "selected")
                // .join(' - '); 
                console.log(textInputs)
                dispatch(fetchExamMode(interestsArray)).then((response) => {
                    navigation.navigate('ExamMode', {
                        package_id: 1,
                        question_data: response.payload,
                        package_name: "Model Exam",
                        tags: "",
                    })

                    setVisible(false);
                    setExamLoader(false)

                })
            });
        }
    }

    const containerStyle = { backgroundColor: 'white', padding: 20, marginTop: verticalScale(-70), width: '90%', alignSelf: 'center', borderRadius: moderateScale(15) };



    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.courses);
    const { packages, loading: packagesLoading, error: packagesError } = useSelector((state) => state.question_packages);

    useEffect(() => {
        readData('interestList').then((data) => {

            const interestsArray = Object.keys(data)
                .filter((key) => data[key] === "selected")
            // .join(' - '); 

            dispatch(fetchCourses(interestsArray)).then((response) => {
                setActive(response.payload[0].course_id)
                setRefreshing(false)
            })
        });
    }, [refreshing]);

    useEffect(() => {
        if (active !== 0) {
            setIsLoading(true);

            dispatch(fetchQuestionPackages(active)).then((response) => {
                // console.log(packages)
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }, [active, dispatch,]);


    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected');
            //   console.log(interestsArray)
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);


    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const savedPackages = JSON.parse(await AsyncStorage.getItem('savedPackages')) || [];
                setIsFavorite(savedPackages);
            } catch (error) {
                console.error('Failed to fetch favorite status', error);
            }
        };

        checkFavoriteStatus();
    }, []);

    const checkFavoriteStatus = (package_id) => {
        return isFavorite.includes(package_id)

    };
    const onRefresh = () => {
        setRefreshing(true);

    };


    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userInformation') || {};
                const userDataa = JSON.parse(userData);
                setFullName(userDataa.fullName);
                setEmailorPhone(userDataa.emailorPhone);
            } catch (error) {
                console.error('Failed to fetch favorite status', error);
            }
        };

        getUserData();
    }, []);

    if (loading || isLoading) {
        return <SkeletonLoader />
    }

    if (error) {
        return <NoInternetScreen isLoading={isLoading} setIsLoading={setIsLoading} />
    }
    return (

        <SafeAreaView style={styles.container}>

            <View style={{
                marginLeft: horizontalScale(10), marginTop: verticalScale(10), marginRight: horizontalScale(10),
                flexDirection: 'row', justifyContent: 'space-between'
            }}>
                <MaterialCommunityIcons name="menu-open" size={moderateScale(24)} color="#222" onPress={showModal} />
                <Ionicons name="notifications-outline" size={moderateScale(24)} color="#222" />
            </View>
            <Card style={{
                marginTop: verticalScale(8), marginBottom: horizontalScale(20), alignSelf: 'center',
                height: verticalScale(80), width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center'
            }} >
                <View style={{ marginLeft: horizontalScale(10), marginRight: horizontalScale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <View>
                        <Image source={require('../assets/avatar.png')} style={{
                            width: horizontalScale(50),
                            height: verticalScale(50), borderRadius: moderateScale(50 / 2)
                        }} />
                    </View>
                    <View style={{ marginLeft: horizontalScale(20) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome {fullName}</Text>
                            <AntDesign name="edit" size={moderateScale(24)} color="#fff" />
                        </View>
                        <Text style={{ color: '#fff', paddingRight: 10 }}>{selectedInterests.join(' - ')}</Text>
                    </View>
                </View>
            </Card>
            <TestAd />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#8FBC8F', height: verticalScale(130), width: horizontalScale(180) }}>
                            <Entypo name="newsletter" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>3</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Recently Posted Items</Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: moderateScale(16), backgroundColor: '#3C565B', height: verticalScale(130), width: horizontalScale(180) }}>
                            <Ionicons name="alarm" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>120</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Most Visited Items</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#7C9D8E', height: verticalScale(130), width: horizontalScale(180) }}>
                            <MaterialIcons name="category" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>7</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Your Saved Items</Text>
                        </View>
                        <View style={{
                            padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#424242', height: verticalScale(130),
                            width: horizontalScale(180)
                        }} >
                            <FontAwesome name="sticky-note" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>13</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Active Items</Text>
                        </View>
                    </View>

                </View>

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {courses.map((course) => (
                            <Text key={course.course_id} onPress={() => setActive(course.course_id)} style={{ margin: moderateScale(20), fontWeight: active == course.course_id ? 'bold' : '', color: active == course.course_id ? '#5E5CE6' : '#CBD1DF' }}>{course.course_name}</Text>
                        ))}
                    </ScrollView>
                </View>

                <View>
                    {isLoading ? (
                        <View style={{ alignItems: 'center', marginTop: verticalScale(20) }}>
                            <Text>Loading...</Text>
                        </View>
                    ) : (
                        packages.map((item) => (
                            <TouchableOpacity
                                key={item.package_id}
                                style={{
                                    marginTop: verticalScale(15),
                                    alignSelf: 'center',
                                    borderRadius: moderateScale(12),
                                    backgroundColor: '#FFFFFF',
                                    width: width - 40,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: moderateScale(4),
                                }}
                                onPress={() => navigation.navigate(item.has_description == 0 ? 'QuizeDescription' : 'QuizeDescription', {
                                    package_id: item.package_id,
                                    package_name: item.package_name,
                                    tags: item.tags,
                                })}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        marginLeft: horizontalScale(15),
                                        marginTop: verticalScale(5),
                                        color: '#fff',
                                        fontSize: moderateScale(13),
                                        alignSelf: 'flex-start',
                                        backgroundColor: '#FF6347',
                                        paddingVertical: verticalScale(5),
                                        paddingHorizontal: horizontalScale(10),
                                        borderRadius: moderateScale(8),
                                        textAlign: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {item.tags}
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        {/* {item.is_locked==1?<Entypo name="lock" style={{ padding: moderateScale(10) }} size={moderateScale(16)} color="#5E5CE6">  </Entypo>:''} */}
                                        <AntDesign name={checkFavoriteStatus(item.package_id) ? "heart" : 'hearto'} style={{ padding: 10 }} size={moderateScale(16)} color="#5E5CE6">  </AntDesign>
                                    </View>
                                </View>

                                <Text style={{ paddingLeft: horizontalScale(10), paddingRight: horizontalScale(10), color: '#222', fontSize: moderateScale(17), alignSelf: 'flex-start' }}>
                                    {item.package_name}
                                </Text>

                                <Text style={{ textAlign: 'justify', padding: moderateScale(5), color: '#dfdfdf', fontSize: moderateScale(13), alignSelf: 'flex-start' }}>
                                    {item.description}
                                </Text>

                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'column' }}>
                                    <View style={{ padding: moderateScale(20), paddingBotom: verticalScale(30), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    <View style={{ height: verticalScale(100), marginBottom: verticalScale(20) }} />
                </View>
                <View style={{ height: verticalScale(100), marginBottom: verticalScale(20) }} />
            </ScrollView>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <Text style={{ fontWeight: 'bold', alignSelf: 'center', alignContent: 'center', fontSize: moderateScale(18) }}>
                    Get a random set of questions and test your understanding in exam mode
                </Text>
                {!exam_loaddr ? (
                    <>
                        <Text style={{ fontWeight: 'bold', alignSelf: 'center', alignContent: 'center', fontSize: moderateScale(17), marginTop: verticalScale(10) }}>
                            Invite users to join this challenge <Text style={{ color: 'green' }}>and make it Fun </Text>
                        </Text>

                        {/* Dynamic text boxes with add and remove feature */}
                        {Array.isArray(textInputs) && textInputs.map((input, index) => (
                            <>
                            <View key={input.id} style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: input.hasError ? 'red' : 'gray',
                                        borderRadius: 10,
                                        padding: 10,
                                        flex: 1,
                                        color: '#222',
                                        fontSize: 16,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,
                                    }}
                                    placeholder="Type Username (optionsl)"
                                    value={input.value}
                                    onChangeText={(text) => handleTextChange(input.id, text)}
                                />

                              
                                <AntDesign
                                    name="delete"
                                    size={moderateScale(24)}
                                    color={(textInputs.length <= 1  && index <= 0) ? '#6a6a6a' : 'red'} // Set color based on condition
                                    onPress={(textInputs.length <= 1  && index <= 0) ? null : () => removeTextInput(input.id)} // Set onPress conditionally
                                    style={{
                                        marginLeft: 10,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                    }}
                                />

                            </View>
                            {input.hasError && <Text style={{color:'red'}}>Invalid username</Text>}
                            </>
                        ))}

                        <TouchableOpacity
                            onPress={addTextInput}
                            style={{
                                alignSelf: 'center',
                                marginTop: verticalScale(10),
                                marginBottom: verticalScale(10),
                                backgroundColor: '#007BFF',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 10,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                                elevation: 5,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>+ Add User</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.getStartedButton} onPress={() => generateExamMode()}>
                            <Text style={styles.buttonText}>Generate Model Exam</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.getStartedButton2}>
                        <Text style={styles.buttonText}>Please wait</Text>
                    </TouchableOpacity>
                )}
            </Modal>

            <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    getStartedButton: {
        backgroundColor: '#5E5CE6',
        height: 50,
        justifyContent: 'center',
        borderRadius: moderateScale(10),
    },
    getStartedButton2: {
        backgroundColor: '#5E5CA6',
        height: 50,
        justifyContent: 'center',
        borderRadius: moderateScale(10),
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
});
