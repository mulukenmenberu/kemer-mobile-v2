// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StatusBar, TextInput, StyleSheet, Text, View, Platform, StatusBar as stbar, Dimensions, SafeAreaView, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import latest from '../data/latest.json'
const hheight = Dimensions.get('screen').height

export default function Jobs({ navigation }) {
    const { width, height } = Dimensions.get('screen')
    const [active, setActive] = useState(0)
 
    const measureTextHeight = (text, fontSize, width) => {
        const numberOfLines = 3.5; // Define the maximum number of lines
        const lineHeight = fontSize * 1.2; // Adjust this value as needed
        const maxHeight = lineHeight * numberOfLines;

        const TextHeight = Math.ceil(text.length / (width / fontSize)) * lineHeight;

        return TextHeight <= maxHeight;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <ImageBackground
                source={require('../assets/image2.png')} // Replace with your background image path
                style={styles.backgroundImage}
            > */}

                <View style={{ marginLeft: 10, marginTop: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* <Image source={require('../assets/logo.png')} style={{ width: 30, height: 30 }} /> */}
                    {/* <Text style={{ fontWeight: 'bold', color: '#fff' }}>Dashboard</Text> */}
                    <MaterialCommunityIcons name="menu-open" size={24} color="#222" />
                    {/* <Text style={{ fontWeight: 'bold' }}>Search</Text> */}
                    {/* <EvilIcons name="search" size={24} color="black" /> */}
                    {/* <AntDesign name="search1" size={24} color="white" /> */}
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
            >
                <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 20, alignSelf:'center' }}>
                    Active Jobs</Text>




                <View>
                    {
                        latest.map((item) => {
                            const isContentExpanded = measureTextHeight(item.content, 17, width - 40);

                            const [isExpanded, setIsExpanded] = useState(true);

                            const containerHeight = isExpanded ? 'auto' : isContentExpanded ? 'auto' : 200;


                            return (
                                <View style={{
                                    marginTop: 15,
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    backgroundColor: '#F5F5F5',
                                    height: containerHeight,
                                    width: width - 40,

                                    // Shadow for iOS
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,

                                    // Elevation for Android
                                    elevation: 5
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <Text style={{ fontWeight: 'bold', padding: 20, color: '#222', fontSize: 20, alignSelf: 'flex-start' }}>{item.title}</Text>
                                        {/* <AntDesign name="save" style={{ padding: 20 }} size={16} color="#1B54DB" /> */}

                                    </View>
                                    {/* <Text style={{paddingLeft:10,paddingRight:10,color:'#222', fontSize:17, alignSelf:'flex-start'}}>{item.content}</Text> */}
                                    <Text style={{ paddingLeft: 10, paddingRight: 10, color: '#222', fontSize: 17, alignSelf: 'flex-start' }}>
                                        {isExpanded ? item.content : `${item.content.substring(0, 3.5 * (width - 40) / 17)}... `}

                                    </Text>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        flexDirection: 'column'
                                    }}>
                                        <View style={{ padding: 20, paddingBotom: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>

                                            {/* <AntDesign name="like1" size={16} color="#fff" > */}




                                        </View>
                                    </View>
                                </View>
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
        // marginTop: Platform.OS === 'android' ? stbar.currentHeight : 0,
        // justifyContent:'center',
        // height: hheight
    },
    backgroundImage: {
        borderBottomLeftRadius: 40,
    }
});
