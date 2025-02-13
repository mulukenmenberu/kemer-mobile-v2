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
  Alert,
  Linking
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';

import { readData, storeData } from '../data/DB';
import SkeletonLoader from '../utils/SkeletonLoader';
import { AdComponent } from '../AdComponent';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rootURL } from '../config/baseApi';
import Header from '../utils/Header';


export default function Settings({ navigation }) {
  const { width } = Dimensions.get('screen');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // const [fullName, setFullName] = useState('');
  // const [emailorPhone, setEmailorPhone] = useState('');
  const [username, setUsername] = useState('');
  const [userIdentifier, setDeviceId] = useState('');
  const [usernameerror, setUsernameError] = useState('');
  const [savingUser, setSavingUser] = useState(false);



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


  const saveIdentifier = async () => {
    setSavingUser(true)
    try {
      const response = await fetch(`${rootURL}users/register_device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdentifier: userIdentifier, username: username }),
      });
      const result = await response.json();

      setSavingUser(false)
      Alert.alert(
        "Registration Success", // Title
        "You have been successfully registered!", // Body
        [
          {
            text: "OK", // Button text
            onPress: () => console.log(""), // Optional onPress handler
          },
        ],
        { cancelable: false } // Optional options
      );

    } catch (error) {
      setSavingUser(false)

    }
  };

  // Save user information to AsyncStorage
  const saveUserInfo = async () => {
    // check if username existed
    setUsernameError('')
    if (username.length <= 0) {
      setUsernameError('  Username is required')
      return
    }

    try {
      setSavingUser(true)
      const response = await fetch(`${rootURL}users/check_username.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, userIdentifier: userIdentifier }),
      });
      const result = await response.json();

      if (result?.status == 'success') {
        const userData = { userIdentifier, username };
        AsyncStorage.setItem('UserIdentifier', userIdentifier);
        await AsyncStorage.setItem('userInformation', JSON.stringify(userData));
        saveIdentifier()
        setSavingUser(false)

      } else {
        setUsernameError('   Username already taken. please try another')
        setSavingUser(false)

      }
    } catch (error) {
      setSavingUser(false)
      Alert.alert(
        "Registration Error", // Title
        "Something went wrong. Please check your network", // Body
        [
          {
            text: "OK", // Button text
            onPress: () => console.log(""), // Optional onPress handler
          },
        ],
        { cancelable: false } // Optional options
      );

    }


  };


  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userInformation') || {};
        const userData2 = JSON.parse(userData);
        // setFullName(userData2.fullName);
        // setEmailorPhone(userData2.emailorPhone);
        setUsername(userData2.username);
        setDeviceId(userData2.userIdentifier);
      } catch (error) {
        console.error('Failed to fetch favorite status', error);
      }
    };

    getUserData();
  }, []);
  const generateRandomID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomDeviceId = '';
    for (let i = 0; i < 32; i++) {
      randomDeviceId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomDeviceId;
  };


  useEffect(() => {
    const fetchDeviceId = async () => {
      const id =  generateRandomID()
      setDeviceId(id);
    };

    // fetchDeviceId();
  }, []);
  if (refresh) {
    return <SkeletonLoader />;
  }


  return (
    <SafeAreaView style={styles.container}>
     <Header  navigation={navigation}/>
      {/* </ImageBackground> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AdComponent />
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
        <Text style={styles.loyaltyTitle}>Bind a Username</Text>

        <View style={{ padding: 20 }}>
         
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="User name"
              value={username}
              placeholderTextColor="#888" 
              onChangeText={setUsername}
            />
            {username ? <Text style={styles.checkmark}>✔️</Text> : null}
          </View>
          {usernameerror.length > 0 && <Text style={{ color: 'red', alignSelf: 'center', marginBottom: verticalScale(50), fontSize: moderateScale(12) }} >          <MaterialCommunityIcons name="cancel" size={moderateScale(12)} color="red" style={{ alignSelf: 'align-right' }} />
            {usernameerror}</Text>}
          {!savingUser ? <TouchableOpacity style={styles.saveButton} onPress={() => saveUserInfo()} >
            <Text style={styles.buttonText}> Save</Text>
          </TouchableOpacity> :
            <TouchableOpacity style={styles.continueButton}  disabled>
              <Text style={styles.buttonText}>Binding Info. Please wait....</Text>
            </TouchableOpacity>}
        </View>
        <TouchableOpacity style={styles.privacyLink} onPress={() => Linking.openURL('https://kemermobile.com/privacy.html')}>
  <MaterialCommunityIcons name="link" size={20} color="#FFFFFF" />
  <Text style={styles.privacyLinkText}>Privacy Policy</Text>
</TouchableOpacity>


        <View style={styles.inputsContainer}>
          {/* <AdComponent/> */}


          <Text style={styles.loyaltyTitle}>Kemer Points</Text>
          <Text style={styles.loyaltyPoints}>Comming Soon</Text>
          <Text style={styles.loyaltyDescription}>
            Kemer points are activity points that you can earn by interacting with the app, taking quizzes, and later can be redeemed for various benefits
          </Text>
          <TouchableOpacity style={styles.continueButton} disabled>
            <Text style={styles.buttonText}>Claim Daily Point</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* <ExamModeModal visible={visible} setVisible={setVisible} showModal={showModal} hideModal={hideModal} navigation={navigation}/> */}

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
  // Inside your styles
privacyLink: {
  backgroundColor: '#6A5ACD', // Distinct green color for attention
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // Shadow for Android
  marginHorizontal: 20,
  marginTop: 20,
},
privacyLinkText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 18,
  marginLeft: 8, // Space between text and icon
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
    color: '#222'
  },
  checkmark: {
    position: 'absolute',
    right: 10,
    top: 12,
    fontSize: 18,
  },
});
