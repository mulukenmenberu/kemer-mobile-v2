import { useEffect, useRef, useState } from 'react';
import {
    Image,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Dimensions,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TestAd } from '../TestAd';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import SkeletonLoaderReader from '../utils/SkeletonLoaderReader';
import NoInternetScreen from '../utils/NoInternetScreen';
import ReadTextMessage from './reader/ReadTextMessage';
import { fetchSubjects } from '../redux/reducers/worksheetSlice';
import SkeletonLoader from '../utils/SkeletonLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReadWorksheet from './reader/ReadWorksheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExamModeModal from '../utils/ExamModeModal';
import Header from '../utils/Header';

const initialCourses = {
    Math_Grade_9: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    Chemistry_Grade_9: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Biology_Grade_9: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
    Physics_Grade_9: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],

    Math_Grade_10: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    Chemistry_Grade_10: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Biology_Grade_10: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
    Physics_Grade_10: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],

    Math_Grade_11: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    Chemistry_Grade_11: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Biology_Grade_11: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
    Physics_Grade_11: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],

    Math_Grade_12: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    Chemistry_Grade_12: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Biology_Grade_12: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
    Physics_Grade_12: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],
};

export default function Worksheets({ navigation }) {
    const [courses, setCourses] = useState({});


    const { width, height } = Dimensions.get('screen');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [courseSelected, setCourseSelected] = useState(0);
    const [changePage, setChangePage] = useState(0);
    const [isloading, setIsLoadingG] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalSubjectVisible, setModalSubjectVisible] = useState(false);

    const scrollViewRef = useRef(null);
    const courseScrollViewRef = useRef(null);
    const topicScrollViewRef = useRef(null);

    const [fullName, setFullName] = useState('');
    const [emailorPhone, setEmailorPhone] = useState('');
    const [exam_loaddr, setExamLoader] = useState(false);

    const dispatch = useDispatch();

    const { subjects, loadings, errors } = useSelector((state) => state.worksheets);

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => {
        if (!exam_loaddr) {
            setVisible(false);
        }
    }

    const fetchSubjectsData = async()=>{
        const data = await readData('interestList');
        const interestsArray = Object.keys(data)
        .filter((key) => data[key] === "selected")
        const levels = interestsArray.map(str =>
            str.toLowerCase()            // Convert to lowercase
                .replace(/,/g, '')        // Remove commas
                .replace(/&/g, 'and')     // Replace & with 'and'
                .replace(/\s+/g, '')      // Remove all spaces
        ).join(',');


        dispatch(fetchSubjects(levels)).then((response) => {
            setCourses(response.payload)
            setRefreshing(false)

        })

    }
    useEffect(() => {
        fetchSubjectsData();
    }, []); // Run only once on mount

    
   /* useEffect(() => {

        readData('interestList').then((data) => {

            const interestsArray = Object.keys(data)
                .filter((key) => data[key] === "selected")


            // Process the array
            const levels = interestsArray.map(str =>
                str.toLowerCase()            // Convert to lowercase
                    .replace(/,/g, '')        // Remove commas
                    .replace(/&/g, 'and')     // Replace & with 'and'
                    .replace(/\s+/g, '')      // Remove all spaces
            ).join(',');


            dispatch(fetchSubjects(levels)).then((response) => {
                setCourses(response.payload)
                setRefreshing(false)
                // console.log(response)
             
            })
        });
    }, [refreshing]);

*/
    const reorderCoursesInPlace = (selectedCourse) => {
        // Reorder and update the state directly
        const selectedTopics = courses[selectedCourse];
        const reorderedCourses = {
            [selectedCourse]: selectedTopics,
            ...Object.keys(courses).reduce((acc, key) => {
                if (key !== selectedCourse) acc[key] = courses[key];
                return acc;
            }, {}),
        };
        setCourses(reorderedCourses);
    };

    const reorderTopicsInPlace = (selectedTopic) => {
        if (selectedCourse) {
            const topics = courses[selectedCourse];
            const reorderedTopics = [
                selectedTopic,
                ...topics.filter((topic) => topic !== selectedTopic)
            ];

            setCourses((prevCourses) => ({
                ...prevCourses,
                [selectedCourse]: reorderedTopics,
            }));
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setSelectedTopic(null);
        setCourseSelected(courseSelected + 1)
        setChangePage(0)
        reorderCoursesInPlace(course);

        if (courseScrollViewRef.current) {
            courseScrollViewRef.current.scrollTo({ x: 0, animated: true });
        }
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setIsLoadingG(true);

        reorderTopicsInPlace(topic);

        if (topicScrollViewRef.current) {
            topicScrollViewRef.current.scrollTo({ x: 0, animated: true });
        }

        // setTimeout(() => {
        setIsLoadingG(false);
        setChangePage(changePage + 1);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: verticalScale(235), animated: true });
        }
        // }, 5000);
    };

    const handleTopicSelectFromModal = (topic) => {

        setSelectedTopic(topic);
        reorderTopicsInPlace(topic);
        setIsLoadingG(true);
        if (topicScrollViewRef.current) {
            topicScrollViewRef.current.scrollTo({ x: 0, animated: true });
        }

        setTimeout(() => {
            setIsLoadingG(false);
            setChangePage(changePage + 1);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: verticalScale(225), animated: true });
            }
        }, 5000);
        setModalVisible(false);
    };
    const handleSubjectSelectFromModal = (course) => {
        setSelectedCourse(course);
        setSelectedTopic(null);
        setCourseSelected(courseSelected + 1)

        setChangePage(0)
        reorderCoursesInPlace(course);
        setModalSubjectVisible(false);

        if (courseScrollViewRef.current) {
            courseScrollViewRef.current.scrollTo({ x: 0, animated: true });
        }
    };



    const renderTopicItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleTopicSelectFromModal(item)}
            style={{
                paddingVertical: 9,
                paddingHorizontal: 15,
                backgroundColor: selectedTopic === item ? '#3ac569' : '#f2f2f2',
                borderRadius: 10,
                margin: 5,
                elevation: 3,
                width: (Dimensions.get('window').width / 2) - 35,
            }}
        >
            <Text style={{ color: '#222', fontSize: 14 }}>{item}</Text>
        </TouchableOpacity>
    );
    const renderSubjectItem = ({ item }) => (

        <TouchableOpacity
            onPress={() => handleSubjectSelectFromModal(item)}
            style={{
                paddingVertical: 9,
                paddingHorizontal: 15,
                backgroundColor: selectedCourse === item ? '#3ac569' : '#f2f2f2',
                borderRadius: 10,
                margin: 5,
                elevation: 3,
                width: (Dimensions.get('window').width / 2) - 35,


            }}
        >
            <Text style={{ color: '#222', fontSize: 14 }}>{item}</Text>
        </TouchableOpacity>
    );
    const backgroundStyle = {
        backgroundColor: Colors.lighter,
    };

    const { news, loading, error } = useSelector((state) => state.news);

    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected');
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSubjectsData()
    };

    // useEffect(() => {
    //     const getUserData = async () => {
    //         try {
    //             const userData = await AsyncStorage.getItem('userInformation') || {};
    //             const userData2 = JSON.parse(userData);
    //             setFullName(userData2.fullName);
    //             setEmailorPhone(userData2.emailorPhone);
    //         } catch (error) {
    //             console.error('Failed to fetch favorite status', error);
    //         }
    //     };

    //     getUserData();
    // }, []);

 
    const isValidObject = (obj) => {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialCommunityIcons name="menu-open" size={24} color="#222"  onPress={showModal}/>
                <Ionicons name="notifications-outline" size={moderateScale(24)} color="#222" />

            </View>
            <Card style={{ marginTop: verticalScale(8), marginBottom: verticalScale(20), alignSelf: 'center', height: verticalScale(80), width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} onPress={() => navigation.navigate('Quiz')}>
                <View style={{ marginLeft: horizontalScale(10), marginRight: verticalScale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View>
                        <Image source={require('../assets/avatar.png')} style={{ width: horizontalScale(50), height: verticalScale(50), borderRadius: moderateScale(50 / 2) }} />
                    </View>
                    <View style={{ marginLeft: horizontalScale(20) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome {fullName}</Text>
                            <AntDesign name="edit" size={moderateScale(24)} color="white" />
                        </View>
                        <Text style={{ color: '#fff', paddingRight: horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                    </View>
                </View>
            </Card> */}
            <Header showModal={showModal} navigation={navigation}/>
            {(loadings || refreshing) && <SkeletonLoader />}
            {(!isValidObject(courses) && !refreshing && !loadings) && <TestAd />}

            {(!isValidObject(courses) && !refreshing && !loadings) && <ReadTextMessage messageText={"No worksheet materials for your selected levels"} onRefresh={onRefresh} refreshing={refreshing} />}
            {( isValidObject(courses) && Object.keys(courses).length > 0) && <>

                    <View>
                        <ScrollView
                            ref={scrollViewRef} refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }>
                            <TestAd />
                            <ScrollView contentContainerStyle={{ padding: 20 }}>
                                {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Select a Subject</Text> */}

                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#222', fontSize: moderateScale(17), fontWeight: 'bold', marginBottom: 10 }}>Select a Subject  </Text>
                                    <FontAwesome name="th-list" size={moderateScale(24)} onPress={() => setModalSubjectVisible(true)} color="black" />

                                </View>

                                {/* Horizontally Scrollable Course Selection */}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} ref={courseScrollViewRef}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {isValidObject(courses) && Object.keys(courses).map((course) => (
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
                                                <Text style={{ color: '#fff', fontSize: 16 }}>{course.replace(/_/g, ' ')}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Horizontally Scrollable Topic Selection */}
                                {selectedCourse && (
                                    <View style={{ width: '100%', marginTop: verticalScale(10) }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: '#222', fontSize: moderateScale(17), fontWeight: 'bold', marginBottom: 10 }}>Select a Topic  </Text>
                                            <FontAwesome name="th-list" size={moderateScale(24)} onPress={() => setModalVisible(true)} color="black" />

                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={topicScrollViewRef}>
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
                                {/* {isloading && <SkeletonLoaderReader />} */}
                                {(changePage > 0 && !isloading) && <ReadWorksheet selectedTopic={selectedTopic} selectedCourse={selectedCourse} />}
                                {(changePage <= 0 || courseSelected <= 0) && <ReadTextMessage messageText={courseSelected <= 0 ? 'Please Select a Subject' : 'Please Select a Topic'} onRefresh={onRefresh} refreshing={refreshing}/>}
                            </ScrollView>
                        </ScrollView>
                    </View>

                    {/* Modal to select topic from grid */}
                    <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                                    <FlatList
                                        // data={courses[selectedCourse]}
                                        data={
                                            courses && selectedCourse in courses && Array.isArray(courses[selectedCourse])
                                                ? courses[selectedCourse]
                                                : [] // Use an empty array if any check fails
                                        }
                                        renderItem={renderTopicItem}
                                        keyExtractor={(item) => item}
                                        numColumns={2}
                                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    />
                                </ScrollView>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal to select topic from grid */}
                    <Modal
                        visible={isModalSubjectVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalSubjectVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                                    <FlatList
                                        // data={courses[selectedCourse]}
                                        // data={Object.keys(courses)}
                                        data={courses ? Object.keys(courses) : []}
                                        renderItem={renderSubjectItem}
                                        keyExtractor={(item) => item}
                                        numColumns={2} // Adjust the number of columns as needed
                                    />
                                </ScrollView>
                                <TouchableOpacity onPress={() => setModalSubjectVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>}
            <ExamModeModal visible={visible} setVisible={setVisible} showModal={showModal} hideModal={hideModal} navigation={navigation} />

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        // padding: 20,
    },
    modalContent: {
        backgroundColor: 'white', // Background color of the modal content
        borderRadius: 10, // Rounded corners
        // padding: 20, // Padding for the content
        maxHeight: '80%', // Limit the height of the modal content
        width: '90%', // Adjust width as needed
        alignItems: 'center'
    },
    closeButton: {
        backgroundColor: '#dbe3de',
        padding: 10,
        borderRadius: 5,
        marginTop: verticalScale(20),
        alignSelf: 'center',
        width: horizontalScale(150),
        borderRadius: 10
    },
    closeButtonText: {
        color: '#222',
        fontSize: moderateScale(18),
        alignSelf: 'center'
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
