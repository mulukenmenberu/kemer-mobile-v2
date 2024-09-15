// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, } from 'react';
import { Image, StatusBar, StyleSheet, Text, View, StatusBar as stbar, Dimensions, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
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
import { fetchNews } from '../redux/reducers/newsSlice';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';

function Section({ children, title }) {
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}



export default function News({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
    const [expandedNews, setExpandedNews] = useState({});

    const backgroundStyle = {
        backgroundColor: Colors.lighter,
    };

    const dispatch = useDispatch();
    const { news, loading, error } = useSelector((state) => state.news);

    const getFirstTwoSentences = (text) => {
        const sentences = text.split('. ').filter(sentence => sentence.trim() !== '');
        return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
    };


    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected')
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);

    useEffect(() => {

        setIsLoading(true);
        dispatch(fetchNews()).then((response) => {
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });

    }, [dispatch]);


    const onRefresh = () => {
        setRefreshing(true);

    };

    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchNews()).then((response) => {
            setIsLoading(false);
            setRefreshing(false)

        }).catch(() => {
            setIsLoading(false);
            setRefreshing(false)

        });


    }, [refreshing]);

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

            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf: 'center', color: '#222' }}>
                    Academic News</Text>
                <TestAd />

                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={backgroundStyle}
                >

                    {/* {news.map((n) => (
                        <Section title={n.title} key={n.id}>
                          <Text style={{color:'black'}}>{n.content}</Text>
                        </Section>
                    ))} */}
                    {news.map((n) => (
                        <Section title={n.title} key={n.id}>
                            <Text style={{ color: 'black' }}>
                                {expandedNews[n.id] ? n.content : getFirstTwoSentences(n.content)}
                            </Text>
                            {n.content.split('. ').length > 2 && (
                                <Text
                                    style={{ color: 'blue', marginTop: 10 }}
                                    onPress={() => setExpandedNews(prev => ({ ...prev, [n.id]: !prev[n.id] }))}
                                >
                                    {expandedNews[n.id] ? 'Read Less' : 'Read More'}
                                </Text>
                            )}
                        </Section>
                    ))}

                </ScrollView>
            </ScrollView>
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
