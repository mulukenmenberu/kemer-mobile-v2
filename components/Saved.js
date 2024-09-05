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

export default function Saved({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const dispatch = useDispatch();
    const { packagesSaved, loading: packagesLoading, error: packagesError } = useSelector((state) => state.question_packages);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const courseId = await AsyncStorage.getItem('savedPackages'); //["1","2"]
            const parsedCourseId = JSON.parse(courseId); // Ensure it's an array
            const commaCourseIDv = parsedCourseId.join(',')
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

if(isLoading) return <Text>Loading....</Text>
    return (
        <SafeAreaView style={styles.container}>
                <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MaterialCommunityIcons name="menu-open" size={24} color="#222" />

                </View>
                <Card style={{ marginTop: 8, marginBottom: 20, alignSelf: 'center', height: 80, width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} onPress={() => navigation.navigate('Quiz')}>
                    <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View>
                            <Image source={require('../assets/avatar.png')} style={{ width: 50, height: 50, borderRadius: 50 / 2 }} />
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19 }}>Welcome </Text>
                                <AntDesign name="edit" size={24} color="white" />
                            </View>
                            <Text style={{ color: '#fff' }}>{selectedInterests.join(' - ')}</Text>
                        </View>
                    </View>
                </Card>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                  <TestAd/>
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf:'center', color:'#222'}}>
                    Saved Items</Text>
                  
                <View>
                    {
                        packagesSaved.map((item) => {
                            return (
                                <TouchableOpacity style={{
                                    marginTop: 15,
                                    alignSelf: 'center',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFFFF',
                                    width: width - 40,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                }}
                                onPress={() => navigation.navigate(item.has_description==0?'Quiz':'QuizeDescription',{
                                    package_id: item.package_id,
                                    package_name: item.package_name,
                                    tags: item.tags,
                                })}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <Text style={{ fontWeight: 'bold', padding: 20, color: '#222', fontSize: 20, alignSelf: 'flex-start' }}>{item.package_name}</Text>

                                    </View>
                                    <Text style={{ paddingLeft: 10, paddingRight: 10, color: '#222', fontSize: 17, alignSelf: 'flex-start' }}>
                                        {item.package_name }
                                    </Text>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        flexDirection: 'column'
                                    }}>
                                        <View style={{ padding: 20, paddingBotom: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
    backgroundImage: {
        borderBottomLeftRadius: 40,
    }
});
