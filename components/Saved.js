// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionPackagesSaved } from '../redux/reducers/questionPackagesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TestAd } from '../TestAd';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import Entypo from 'react-native-vector-icons/Entypo';

export default function Saved({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isFavorite, setIsFavorite] = useState([]);
    const [fullName, setFullName] = useState('');
    const [emailorPhone, setEmailorPhone] = useState('');

    const dispatch = useDispatch();
    const { packagesSaved, loading: packagesLoading, error: packagesError } = useSelector((state) => state.question_packages);

    const checkFavoriteStatus =  (package_id) => {
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
        // fetchData().then(() => setRefreshing(false)); // Refresh data on pull
    };
      useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userInformation') || {};
                const userData2 = JSON.parse(userData);
                setFullName(userData2.fullName);
                setEmailorPhone(userData2.emailorPhone);
            } catch (error) {
                console.error('Failed to fetch favorite status', error);
            }
        };

        getUserData();
    }, []);
if(isLoading) return <Text>Loading....</Text>
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
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome {fullName}</Text>
                                <AntDesign name="edit" size={moderateScale(24)} color="white" />
                            </View>
                            <Text style={{ color: '#fff', paddingRight:horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                        </View>
                    </View>
                </Card>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                  <TestAd/>
                <Text style={{ marginLeft: horizontalScale(10), marginTop: verticalScale(10), fontSize: moderateScale(20),
                     alignSelf:'center', color:'#222'}}>
                    Saved Items</Text>
                  
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
                                    {/* {item.is_locked==1?<Entypo name="lock" style={{ padding: moderateScale(10) }} size={moderateScale(16)} color="#5E5CE6">  </Entypo>:''} */}
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
                            )
                        })
                    }
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

    },

});
