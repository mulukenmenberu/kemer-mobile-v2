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

export default function Dashboard({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [active, setActive] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);

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

      const checkFavoriteStatus =  (package_id) => {
          return isFavorite.includes(package_id)

      };

      const onRefresh = () => {
        setRefreshing(true);

    };
      if (loading || isLoading) {
        return <SkeletonLoader/>
      }
    
      if (error) {
        return <NoInternetScreen isLoading={isLoading} setIsLoading={setIsLoading}/>
      }
    return (

        <SafeAreaView style={styles.container}>

                <View style={{ marginLeft: horizontalScale(10), marginTop: verticalScale(10), marginRight: horizontalScale(10), 
                    flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MaterialCommunityIcons name="menu-open" size={moderateScale(24)} color="#222" />
                </View>
                <Card style={{ marginTop: verticalScale(8), marginBottom: horizontalScale(20), alignSelf: 'center',
                     height: verticalScale(80), width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} >
                    <View style={{ marginLeft: horizontalScale(10), marginRight: horizontalScale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View>
                            <Image source={require('../assets/avatar.png')} style={{ width: horizontalScale(50),
                                 height: verticalScale(50), borderRadius: moderateScale(50 / 2) }} />
                        </View>
                        <View style={{ marginLeft: horizontalScale(20) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome </Text>
                                <AntDesign name="edit" size={moderateScale(24)} color="#fff" />
                            </View>
                            <Text style={{ color: '#fff', paddingRight:10 }}>{selectedInterests.join(' - ')}</Text>
                        </View>
                    </View>
                </Card>
            {/* </ImageBackground> */}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20 }}> Welcome, Muluken</Text> */}
                    <TestAd/>

                <View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#FF8A80', height: verticalScale(130), width: horizontalScale(180) }}>
                            <Entypo name="newsletter" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>3</Text>
                            <Text style={{ color: '#fff', fontSize: moderateScale(13) }}>Recently Posted Items</Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: moderateScale(16), backgroundColor: '#FDD835', height: verticalScale(130), width: horizontalScale(180) }}>
                            <Ionicons name="alarm" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>120</Text>
                            <Text style={{ color: '#fff', fontSize: moderateScale(13) }}>Most Visited Items</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#5C6BC0', height: verticalScale(130), width: horizontalScale(180) }}>
                            <MaterialIcons name="category" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>7</Text>
                            <Text style={{ color: '#fff', fontSize: moderateScale(13) }}>Your Saved Items</Text>
                        </View>
                        <View style={{ padding: moderateScale(10), borderRadius: moderateScale(16), backgroundColor: '#424242', height: verticalScale(130),
                             width: horizontalScale(180) }} >
                            <FontAwesome name="sticky-note" size={moderateScale(24)} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: moderateScale(35) }}>13</Text>
                            <Text style={{ color: '#fff', fontSize: moderateScale(13) }}>Active Items</Text>
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
                                onPress={() => navigation.navigate(item.has_description==0?'Quiz':'QuizeDescription', {
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
                                    <View style={{display:'flex', flexDirection:'row',justifyContent:'space-evenly'}}>
                                    {item.is_locked==1?<Entypo name="lock" style={{ padding: moderateScale(10) }} size={moderateScale(16)} color="#5E5CE6">  </Entypo>:''}
                                    <AntDesign name={checkFavoriteStatus(item.package_id)?"heart":'hearto'} style={{ padding: 10 }} size={moderateScale(16)} color="#5E5CE6">  </AntDesign>
                                    </View>
                                </View>
          
                                <Text style={{ paddingLeft: horizontalScale(10), paddingRight: horizontalScale(10), color: '#222', fontSize: moderateScale(17), alignSelf: 'flex-start' }}>
                                    {item.package_name}
                                </Text>

                                <Text style={{ textAlign: 'justify', padding:moderateScale(5), color: '#dfdfdf', fontSize: moderateScale(13), alignSelf: 'flex-start' }}>
                                    {item.description}
                                </Text>

                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'column' }}>
                                    <View style={{ padding: moderateScale(20), paddingBotom: verticalScale(30), flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    <View style={{ height: verticalScale(100) , marginBottom:verticalScale(20)}} />
                </View>
                <View style={{ height: verticalScale(100) , marginBottom:verticalScale(20)}} />

            </ScrollView>
            <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
    },

});
