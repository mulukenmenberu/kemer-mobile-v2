// import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, StatusBar as stbar, Dimensions, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TestAd } from '../TestAd';
import { useDispatch, useSelector } from 'react-redux';

import {
    Colors,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';
import ReadText from './reader/ReadText';


export default function News({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing


    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [changePage, setChangePage] = useState(0);

    const scrollViewRef = useRef(null);


    const courses = {
        Math: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
        Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
        Biology: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
        Physics: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setSelectedTopic(null); // Reset topic when a new course is selected

    };


    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setChangePage(changePage + 1)
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: verticalScale(225), animated: true });
        }
    };


    const backgroundStyle = {
        backgroundColor: Colors.lighter,
    };

    const { news, loading, error } = useSelector((state) => state.news);


    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected')
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);




    const onRefresh = () => {
        setRefreshing(true);

    };

    if (loading || isLoading) {
        return <SkeletonLoader />
    }

    if (error) {
        return <NoInternetScreen isLoading={isLoading} setIsLoading={setIsLoading} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialCommunityIcons name="menu-open" size={24} color="#222" />

            </View>
            <Card style={{ marginTop: verticalScale(8), marginBottom: verticalScale(20), alignSelf: 'center', height: verticalScale(80), width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} onPress={() => navigation.navigate('Quiz')}>
                <View style={{ marginLeft: horizontalScale(10), marginRight: verticalScale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View>
                        <Image source={require('../assets/avatar.png')} style={{ width: horizontalScale(50), height: verticalScale(50), borderRadius: moderateScale(50 / 2) }} />
                    </View>
                    <View style={{ marginLeft: horizontalScale(20) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome </Text>
                            <AntDesign name="edit" size={moderateScale(24)} color="white" />
                        </View>
                        <Text style={{ color: '#fff', paddingRight: horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                    </View>
                </View>
            </Card>
            <View>
                <ScrollView
               
                    ref={scrollViewRef} refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    {/* <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf: 'center', color: '#222' }}>Preparation Notes</Text> */}
                    <TestAd />
                    <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Select a Course</Text>

                        {/* Horizontally Scrollable Course Selection */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                {Object.keys(courses).map((course) => (
                                    <TouchableOpacity
                                        key={course}
                                        onPress={() => handleCourseSelect(course)}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 20,
                                            backgroundColor: selectedCourse === course ? '#3ac569' : '#2e78f0',
                                            borderRadius: 10,
                                            marginHorizontal: 5,
                                            elevation: 3,
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 16 }}>{course}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Horizontally Scrollable Topic Selection */}
                        {selectedCourse && (
                            <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Select a Topic</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {courses[selectedCourse].map((topic) => (
                                            <TouchableOpacity
                                                key={topic}
                                                onPress={() => handleTopicSelect(topic)}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 15,
                                                    backgroundColor: selectedTopic === topic ? '#3ac569' : '#2e78f0',
                                                    borderRadius: 10,
                                                    marginHorizontal: 5,
                                                    elevation: 3,
                                                }}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 14 }}>{topic}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </ScrollView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={backgroundStyle}
                    >

                        <Text></Text>
                        {changePage > 0 && <ReadText />}
                    </ScrollView>
                </ScrollView>
            </View>

            <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

    },

    sectionContainer: {
        marginTop: verticalScale(32),
        paddingHorizontal: horizontalScale(24),

    },
    sectionTitle: {
        fontSize: moderateScale(24),
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: verticalScale(8),
        fontSize: moderateScale(18),
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});
