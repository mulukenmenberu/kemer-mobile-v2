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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TestAd } from '../TestAd';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';
import ReadText from './reader/ReadText';

export default function News({ navigation }) {
    const { width, height } = Dimensions.get('screen');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [changePage, setChangePage] = useState(0);
    const [isloading, setIsLoadingG] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const scrollViewRef = useRef(null);

    const courses = {
        Math: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
        Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
        Biology: ['Genetics', 'Ecology', 'Cell Biology', 'Anatomy'],
        Physics: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics'],
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setSelectedTopic(null);
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setIsLoadingG(true);
        setTimeout(() => {
            setIsLoadingG(false);
            setChangePage(changePage + 1);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: verticalScale(225), animated: true });
            }
        }, 5000);
    };

    const handleTopicSelectFromModal = (topic) => {
        setSelectedTopic(topic);
        setIsLoadingG(true);
        setTimeout(() => {
            setIsLoadingG(false);
            setChangePage(changePage + 1);
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: verticalScale(225), animated: true });
            }
        }, 5000);
        setModalVisible(false);
    };

    const renderTopicItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleTopicSelectFromModal(item)}
            style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: selectedTopic === item ? '#3ac569' : '#2e78f0',
                borderRadius: 10,
                margin: 5,
                elevation: 3,
            }}
        >
            <Text style={{ color: '#fff', fontSize: 14 }}>{item}</Text>
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
    };

    if (error) {
        return <NoInternetScreen isLoading={isLoading} setIsLoading={setIsLoading} />;
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
                            <View style={{ width: '100%', alignItems: 'center', marginTop: verticalScale(10) }}>
                                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Select a Topic  </Text>
                                <AntDesign name="select1" size={moderateScale(24)} onPress={() => setModalVisible(true)}  color="black" />

                                {/* <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedTopic || 'Select a Topic'}</Text>
                                    <MaterialCommunityIcons name="menu-down" size={24} color="#222" style={{ marginLeft: 5 }} />
                                </TouchableOpacity> */}
                                </View>
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
                        {isloading && <SkeletonLoader />}
                        {changePage > 0 && <ReadText />}
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
                                data={courses[selectedCourse]}
                                renderItem={renderTopicItem}
                                keyExtractor={(item) => item}
                                numColumns={2} // Adjust the number of columns as needed
                            />
                        </ScrollView>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        alignSelf:'center'
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
