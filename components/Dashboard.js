// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, RefreshControl, Alert, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetchCourses } from '../redux/reducers/coursesSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';
import { readData } from '../data/DB';
import { TestAd } from '../TestAd';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';

import Header from '../utils/Header';
import DashBoardCardsModal from '../utils/DashBoardCardsModal';
export default function Dashboard({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [active, setActive] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState([]);
    const [packageData, setPackageData] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [exam_loaddr, setExamLoader] = useState(false);
    const [showPackages, setShowPackages] = useState(false);



    const [visibleCourses, setVisibleCourses] = useState(false);
    const showCoursesModal = () => setVisibleCourses(true);
    const hideCoursesModal = () => {
        // if (!exam_loaddr) {
        setVisibleCourses(false);
        setShowPackages(false);
        // }
    }

    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.courses);


    const fetchCoursesData = async () => {
        // setRefreshing(true); // Set refreshing true to indicate loading state
        const data = await readData('interestList');
        const interestsArray = Object.keys(data).filter((key) => data[key] === "selected");

        // Call the API only if interestsArray has values
        if (interestsArray.length > 0) {
            const response = dispatch(fetchCourses(interestsArray)).then((res) => {
                if (res && res.payload.length > 0) {
                    setActive(res.payload[0].course_id);
                    setPackageData(res.payload[0].packages);
                }
            })


        }
        setRefreshing(false); // Set refreshing false once data is fetched
    };
    useEffect(() => {
        fetchCoursesData();
    }, []); // Run only once on mount




    const getPackagesByCourseId = (courseId) => {
        const course = courses.find(course => course.course_id === courseId);
        return course ? course.packages : []; // Return packages or an empty array if not found
    };

    useEffect(() => {
        if (active !== 0) {
            setIsLoading(true);
            const packages = getPackagesByCourseId(active);
            setPackageData(packages)
          
            setIsLoading(false);

        }
    }, [active]);


    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected');
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
              
            }
        };

        checkFavoriteStatus();
    }, [refresh]);

    const checkFavoriteStatus = (package_id) => {
        return isFavorite.includes(package_id)

    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchCoursesData()

    };

    const renderPackagesonModal = () => {
        showCoursesModal()
        setShowPackages(true)
    }
    const currentDate = new Date();
    const targetDate = new Date('2024-12-15');

    if (loading || isLoading) {
        return <SkeletonLoader />
    }

    if (error) {
        return <NoInternetScreen isLoading={isLoading} setIsLoading={setIsLoading} />
    }


    const extractedPackages = courses.reduce((acc, course) => {
        return acc.concat(course.packages); // Concatenate packages from each course
    }, []);

    return (

        <SafeAreaView style={styles.container}>


            {/* <Header showModal={showModal} navigation={navigation} courses={courses}/> */}
            <Header navigation={navigation} />

            <TestAd />
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Pressable style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#6977ed', height: verticalScale(130), width: horizontalScale(180) }} onPress={showCoursesModal}>
                            <Entypo name="newsletter" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>{courses.length}</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Subjects (course groups) </Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>in your level</Text>
                        </Pressable>
                        <Pressable style={{ padding: 10, borderRadius: moderateScale(16), backgroundColor: '#07beb8', height: verticalScale(130), width: horizontalScale(180) }} onPress={() => renderPackagesonModal()}>
                            <Ionicons name="alarm" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>{extractedPackages.length}⁺</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}> Packages in your level</Text>
                            {/* <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>in your selected levs</Text> */}
                        </Pressable>
                    </View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Pressable style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#9013fe', height: verticalScale(130), width: horizontalScale(180) }} onPress={() => navigation.navigate('Saved')}>
                            <MaterialIcons name="category" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>{isFavorite.length}</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Your Saved Package {isFavorite.length > 1 ? 's' : ''}</Text>
                        </Pressable>
                        <Pressable style={{
                            padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#50e3c2', height: verticalScale(130),
                            width: horizontalScale(180)
                        }} onPress={() => renderPackagesonModal()}>
                            <FontAwesome name="sticky-note" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>{extractedPackages.length * 100}⁺</Text>
                            <Text style={{ alignSelf: 'center', color: '#fff', fontSize: moderateScale(13) }}>Total Questions in you level</Text>
                        </Pressable>
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
                        packageData.map((item) => (
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

                    <View style={{ height: verticalScale(100), padding: moderateScale(10) }} >
                        {currentDate <= targetDate && (
                            <Text style={{ color: 'black', alignSelf: 'center', color:'#d0d3d6' }}>We're working hard to add more questions. stay tuned!</Text>
                        )}
                    </View>
                    <View style={{ height: verticalScale(100), marginBottom: verticalScale(10), padding: moderateScale(10) }} />

                </View>
                <View style={{ height: verticalScale(30), marginBottom: verticalScale(20) }} />
            </ScrollView>
            {/* <ExamModeModal visible={visible} setVisible={setVisible} showModal={showModal} hideModal={hideModal} navigation={navigation} /> */}
            <DashBoardCardsModal visible={visibleCourses} showModal={showCoursesModal} hideModal={hideCoursesModal} navigation={navigation} courses={courses} setActive={setActive} showPackages={showPackages} />


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
    tag: {
        color: '#fff',
        fontSize: 10,
        backgroundColor: '#FF6347',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: "30%",
        textAlign: 'center',
        overflow: 'hidden'
    },
});
