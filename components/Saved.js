// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionPackagesSaved } from '../redux/reducers/questionPackagesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Test } from '../Test';

export default function Saved({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

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
        fetchData();
    }, [dispatch, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
        // fetchData().then(() => setRefreshing(false)); // Refresh data on pull
    };

if(isLoading) return <Text>Loading....</Text>
    return (
        <SafeAreaView style={styles.container}>
            {/* <ImageBackground
                source={require('../assets/image2.png')} // Replace with your background image path
                style={styles.backgroundImage}
            > */}
                <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* <Image source={require('../assets/logo.png')} style={{ width: 30, height: 30 }} /> */}
                    {/* <Text style={{ fontWeight: 'bold', color: '#fff' }}>Dashboard</Text> */}
                    {/* <AntDesign name="search1" size={24} color="white" /> */}
                    <MaterialCommunityIcons name="menu-open" size={24} color="#222" />

                </View>
                <Card style={{ marginTop: 8, marginBottom: 20, alignSelf: 'center', height: 80, width: width - 20, backgroundColor: '#5E5CE6', justifyContent: 'center' }} onPress={() => navigation.navigate('Quiz')}>
                    <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View>
                            <Image source={require('../assets/avatar.png')} style={{ width: 50, height: 50, borderRadius: 50 / 2 }} />
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19 }}>Muluken M </Text>
                                <AntDesign name="edit" size={24} color="white" />
                            </View>
                            <Text style={{ color: '#fff' }}>Information Technology - 3rd year</Text>
                        </View>
                    </View>
                </Card>
            {/* </ImageBackground> */}
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf:'center' }}>
                    Saved Items</Text>
                    <Test/>
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
                                onPress={() => navigation.navigate('Quiz', {
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
