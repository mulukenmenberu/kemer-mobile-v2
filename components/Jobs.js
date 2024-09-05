// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, } from 'react';
import { useColorScheme, Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TestAd } from '../TestAd';
const hheight = Dimensions.get('screen').height

import {
    Colors,
    Header,
    DebugInstructions,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { readData } from '../data/DB';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';

function Section({ children, title }) {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color:  Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color:  Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}



export default function Jobs({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const isDarkMode = useColorScheme() === 'dark';
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    useEffect(() => {
        readData('interestList').then((data) => {
            const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected')
            //   .join(' - ');
            setSelectedInterests(interestsArray);
            setRefresh(false);
        });
    }, [refresh]);

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
                            <Text style={{ color: '#fff', paddingRight:horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
                        </View>
                    </View>
                </Card>

            <ScrollView >
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf: 'center', color: '#222' }}>
                    Academic News</Text>
                <TestAd />

                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={backgroundStyle}
                    >

                    <View
                        style={{
                            backgroundColor: Colors.white,
                        }}>
                        <Section title="Step One">
                            Edit <Text style={styles.highlight}>App.js</Text> to change this
                            screen and then come back to see your edits.
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>


                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="">
                            {/* <ReloadInstructions /> */}
                        </Section>
                    </View>
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
