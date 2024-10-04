import React, { useState, useEffect } from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StatusBar, Button,
  Alert
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';

import { readData, storeData } from '../data/DB';
import SkeletonLoader from '../utils/SkeletonLoader';
import { TestAd } from '../TestAd';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import Welcome from './Welcome';
import DeviceInfo from 'react-native-device-info';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { rootURL } from '../config/baseApi';


export default function Settings({ navigation }) {
  const { width } = Dimensions.get('screen');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [fullName, setFullName] = useState('');
  const [emailorPhone, setEmailorPhone] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const toggleInterest = (interest) => {
    // Step 1: Update the selected interests state
    setSelectedInterests((prevSelectedInterests) => {
      const updatedSelectedInterests = prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest];

      // Step 2: Update the interests based on the latest selected interests
      const updatedInterests = { ...allInterests };

      for (let value of Object.values(updatedInterests)) {
        updatedInterests[value] = updatedSelectedInterests.includes(value)
          ? 'selected'
          : 'notselected';
      }

      // Step 3: Store the updated interests in local storage
      storeData('interestList', updatedInterests);

      return updatedSelectedInterests; // Return the updated interests to be set
    });
  };


  const toggleInterestt = (interest) => {
    let updatedInterests = { ...allInterests };

    setSelectedInterests((prevSelectedInterests) =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest]
    );

    console.log(selectedInterests)
    // for (let key in updatedInterests) {
    for (let value of Object.values(updatedInterests)) {

      if (selectedInterests.includes(value)) {
        updatedInterests[value] = 'selected';
      } else {
        updatedInterests[value] = 'notselected';
      }
    }

    storeData('interestList', updatedInterests);
  };



  const dispatch = useDispatch();
  const { departments = [], loading, error } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    readData('interestList').then((data) => {
      const interestsArray = Object.keys(data).filter((key) => data[key] === 'selected')
      // .join(' - ');
      setSelectedInterests(interestsArray);
      setAllInterests(Object.keys(data));
      setRefresh(false);
    });
  }, [refresh]);

  // Split departments into chunks of 6
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const departmentChunks = chunkArray(departments, 6);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentPageIndex = Math.round(offsetX / width);
    setCurrentPage(currentPageIndex);
  };


  const saveDeviceIdToServer = async () => {
    try {
      const response = await fetch(`${rootURL}users/register_device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId, full_name: fullName, email: emailorPhone }),
      });
      const result = await response.json();
      console.log('Device ID saved to server:', result);
      
      Alert.alert(
        "Registration Success", // Title
        "You have been successfully registered!", // Body
        [
          {
            text: "OK", // Button text
            onPress: () => console.log("OK Pressed"), // Optional onPress handler
          },
        ],
        { cancelable: false } // Optional options
      );

    } catch (error) {
      console.error('Error saving device ID to server:', error);
    }
  };

  // Save user information to AsyncStorage
  const saveUserInfo = async () => {
    const userData = { fullName, emailorPhone, deviceId };
    await AsyncStorage.setItem('userInformation', JSON.stringify(userData));
    saveDeviceIdToServer()
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
  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };

    fetchDeviceId();
  }, []);
  if (refresh) {
    return <SkeletonLoader />;
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
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: moderateScale(19) }}>Welcome {fullName}</Text>
              <AntDesign name="edit" size={moderateScale(24)} color="white" />
            </View>
            <Text style={{ color: '#fff', paddingRight: horizontalScale(10) }}>{selectedInterests.join(' - ')}</Text>
          </View>
        </View>
      </Card>
      {/* </ImageBackground> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TestAd />
        <Text style={styles.mainTitle}>Time to customize your level</Text>


        {/* Custom Swiper for Interests */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.swiper}
        >
          {departmentChunks.map((chunk, pageIndex) => (
            <View key={pageIndex} style={styles.interestsContainer}>
              {chunk.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestButton,
                    selectedInterests.includes(interest.department_name) && styles.selectedInterest,
                  ]}
                  onPress={() => toggleInterest(interest.department_name)}
                >
                  <MaterialCommunityIcons
                    name={interest.icon}
                    color={selectedInterests.includes(interest.department_name) ? '#FFFFFF' : '#555'}
                    size={40}
                  />
                  <Text
                    style={[
                      styles.interestText,
                      selectedInterests.includes(interest.department_name) && styles.selectedInterestText,
                    ]}
                  >
                    {interest.department_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Dot Indicator */}
        <View style={styles.dotContainer}>
          {departmentChunks.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <Text style={styles.loyaltyTitle}>Bind Name and Email(phone)</Text>

        <View style={{ padding: 20 }}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
            />
            {fullName ? <Text style={styles.checkmark}>✔️</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Email or phone"
              value={emailorPhone}
              onChangeText={setEmailorPhone}
            />
            {emailorPhone ? <Text style={styles.checkmark}>✔️</Text> : null}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={() => saveUserInfo()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
          {/* <TestAd/> */}


          <Text style={styles.loyaltyTitle}>Kelem Points</Text>
          <Text style={styles.loyaltyPoints}>Comming Soon</Text>
          <Text style={styles.loyaltyDescription}>
            Loyalty points are activity points that you can earn by interacting with the app, taking quizzes, and later can be redeemed for various benefits
          </Text>
          <TouchableOpacity style={styles.continueButton} disabled>
            <Text style={styles.buttonText}>Claim Daily Point</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: horizontalScale(10),
    marginTop: verticalScale(10),
    marginRight: horizontalScale(10),
  },
  logo: {
    width: horizontalScale(30),
    height: verticalScale(30),
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    alignSelf: 'center',
    height: verticalScale(80),
    width: Dimensions.get('screen').width - 20,
    backgroundColor: '#5E5CE6',
    justifyContent: 'center',
  },
  cardContent: {
    marginLeft: horizontalScale(10),
    marginRight: horizontalScale(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
  },
  cardText: {
    marginLeft: horizontalScale(20),
  },
  cardHeader: {
    flexDirection: 'row',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(19),
  },
  cardSubTitle: {
    color: '#fff',
  },
  scrollContainer: {
    // padding: 20,
  },
  mainTitle: {
    marginLeft: horizontalScale(10),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    fontSize: moderateScale(20),
    color: '#222',
    alignSelf: 'center',
  },
  swiper: {
    marginTop: verticalScale(10),
  },
  interestsContainer: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',

  },
  interestButton: {
    width: '30%',
    marginVertical: verticalScale(10),
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#5E5CE6',
  },
  interestText: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
    color: '#555',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(10),
  },
  dot: {
    width: horizontalScale(8),
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#ccc',
    marginHorizontal: horizontalScale(4),
  },
  activeDot: {
    backgroundColor: '#5E5CE6',
  },
  inputsContainer: {
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },

  loyaltyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(20),
    alignSelf: 'center',
    color: '#222'
  },
  loyaltyPoints: {
    fontSize: moderateScale(18),
    color: '#5E5CE6',
    marginVertical: verticalScale(10),
    alignSelf: 'center'
  },
  loyaltyDescription: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(20),
  },
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    opacity: 0.5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    // opacity: 0.5,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    paddingRight: 30, // Make room for the checkmark
    flex: 1,
  },
  checkmark: {
    position: 'absolute',
    right: 10,
    top: 12,
    fontSize: 18,
  },
});
