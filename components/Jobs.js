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

function Section({ children, title }) {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
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
                        <Text style={{ color: '#fff' }}>{selectedInterests}</Text>
                    </View>
                </View>
            </Card>
            <ScrollView >
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf: 'center' }}>
                    Academic News</Text>
                <TestAd />

                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={backgroundStyle}>
                    <Header />
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        }}>
                        <Section title="Step One">
                            Edit <Text style={styles.highlight}>App.js</Text> to change this
                            screen and then come back to see your edits.
                        </Section>
                        <Section title="See Your Changes">
                            <ReloadInstructions />
                        </Section>
                        <Section title="Debug">
                            <DebugInstructions />
                        </Section>
                        <Section title="Learn More">
                            Read the docs to discover what to do next:
                        </Section>
                        <LearnMoreLinks />
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
    backgroundImage: {
        borderBottomLeftRadius: 40,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});
