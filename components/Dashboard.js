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

                <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MaterialCommunityIcons name="menu-open" size={24} color="#222" />
                </View>
                <Card style={{ marginTop: 8, marginBottom: 20, alignSelf: 'center', height: 80, width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} >
                    <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <View>
                            <Image source={require('../assets/avatar.png')} style={{ width: 50, height: 50, borderRadius: 50 / 2 }} />
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19 }}>Welcome </Text>
                                <AntDesign name="edit" size={24} color="#fff" />
                            </View>
                            <Text style={{ color: '#fff' }}>{selectedInterests}</Text>
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
                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#FF8A80', height: 130, width: 180 }}>
                            <Entypo name="newsletter" size={24} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>3</Text>
                            <Text style={{ color: '#fff', fontSize: 13 }}>Recently Posted Items</Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#FDD835', height: 130, width: 180 }}>
                            <Ionicons name="alarm" size={24} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>120</Text>
                            <Text style={{ color: '#fff', fontSize: 13 }}>Most Visited Items</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#5C6BC0', height: 130, width: 180 }}>
                            <MaterialIcons name="category" size={24} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>7</Text>
                            <Text style={{ color: '#fff', fontSize: 13 }}>Your Saved Items</Text>
                        </View>
                        <View style={{ padding: 10, borderRadius: 20, backgroundColor: '#424242', height: 130, width: 180 }} >
                            <FontAwesome name="sticky-note" size={24} style={{ alignSelf: 'flex-end' }} color="#fff" />
                            <Text style={{ alignSelf: 'center', color: '#fff', fontWeight: 'bold', fontSize: 35 }}>13</Text>
                            <Text style={{ color: '#fff', fontSize: 13 }}>Active Items</Text>
                        </View>
                    </View>

                </View>

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {courses.map((course) => (
                            <Text key={course.course_id} onPress={() => setActive(course.course_id)} style={{ margin: 20, fontWeight: active == course.course_id ? 'bold' : '', color: active == course.course_id ? '#5E5CE6' : '#CBD1DF' }}>{course.course_name}</Text>
                        ))}


                    </ScrollView>
                </View>
              
                <View>
                    {isLoading ? (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text>Loading...</Text>
                        </View>
                    ) : (
                        packages.map((item) => (
                            <TouchableOpacity
                                key={item.package_id}
                                style={{
                                    marginTop: 15,
                                    alignSelf: 'center',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFFFF',
                                    width: width - 40,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
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
                                        marginLeft: 15,
                                        marginTop: 5,
                                        color: '#fff', 
                                        fontSize: 13,
                                        alignSelf: 'flex-start',
                                        backgroundColor: '#FF6347', 
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        borderRadius: 8, 
                                        textAlign: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {item.tags}
                                    </Text>
                                    <View style={{display:'flex', flexDirection:'row',justifyContent:'space-evenly'}}>
                                    {item.is_locked==1?<Entypo name="lock" style={{ padding: 10 }} size={16} color="#5E5CE6">  </Entypo>:''}
                                    <AntDesign name={checkFavoriteStatus(item.package_id)?"heart":'hearto'} style={{ padding: 10 }} size={16} color="#5E5CE6">  </AntDesign>
                                    </View>
                                </View>
          
                                <Text style={{ paddingLeft: 10, paddingRight: 10, color: '#222', fontSize: 17, alignSelf: 'flex-start' }}>
                                    {item.package_name}
                                </Text>

                                <Text style={{ textAlign: 'justify', padding:5, color: '#dfdfdf', fontSize: 13, alignSelf: 'flex-start' }}>
                                    {item.description}
                                </Text>

                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'column' }}>
                                    <View style={{ padding: 20, paddingBotom: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    <View style={{ height: 100 , marginBottom:20}} />
                </View>
                <View style={{ height: 100 , marginBottom:20}} />

            </ScrollView>
            <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    backgroundImage: {
        borderBottomLeftRadius: 40,
    }
});
