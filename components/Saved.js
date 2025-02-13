// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionPackagesSaved } from '../redux/reducers/questionPackagesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AdComponent } from '../AdComponent';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';

import SkeletonLoader from '../utils/SkeletonLoader';
import ExamModeModal from '../utils/ExamModeModal';
import Header from '../utils/Header';

export default function Saved({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isFavorite, setIsFavorite] = useState([]);
    const [fullName, setFullName] = useState('');
    const [emailorPhone, setEmailorPhone] = useState('');
    const [exam_loaddr, setExamLoader] = useState(false);

    const dispatch = useDispatch();
    const { packagesSaved, loading: packagesLoading, error: packagesError } = useSelector((state) => state.question_packages);
 

    const checkFavoriteStatus = (package_id) => {
        return isFavorite.includes(package_id)

    };

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

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const courseId = await AsyncStorage.getItem('savedPackages'); //["1","2"]
            const parsedCourseId = JSON.parse(courseId); // Ensure it's an array
            const commaCourseIDv = parsedCourseId?.join(',')
            dispatch(fetchQuestionPackagesSaved(`course_ids=${commaCourseIDv}`))
        } catch (error) {
            console.error('Failed to fetch question packages:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false)
        }
    };



    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected')
            //   .join(' - ');
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);
    useEffect(() => {
        fetchData();
    }, [dispatch, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
    };
   
    return (
        <SafeAreaView style={styles.container}>
             
             <Header  navigation={navigation}/>

            <AdComponent />
            {/* <SkeletonLoader/> */}
           {isLoading? <SkeletonLoader/>: <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {packagesSaved.length <= 0 ? <Text style={{ fontSize: moderateScale(25), color: "#dfdfdf", justifyContent: 'center', alignSelf: 'center', marginTop: verticalScale(150) }}>No saved items found</Text> :
                    <>
                        <Text style={{
                            marginLeft: horizontalScale(10), marginTop: verticalScale(10), fontSize: moderateScale(20),
                            alignSelf: 'center', color: '#222'
                        }}>
                            Saved Question Packages</Text>

                        <View>
                            {
                                packagesSaved.map((item) => {
                                    return (
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
                                    )
                                })
                            }
                        </View>
                    </>}

            </ScrollView>}
            <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
            {/* <ExamModeModal visible={visible} setVisible={setVisible} showModal={showModal} hideModal={hideModal} navigation={navigation}/> */}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },

});
