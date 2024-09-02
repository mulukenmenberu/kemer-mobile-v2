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
  StatusBar,
} from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';

import { readData, storeData } from '../data/DB';
import SkeletonLoader from '../utils/SkeletonLoader';
import { TestAd } from '../TestAd';

export default function Settings({ navigation }) {
  const { width } = Dimensions.get('screen');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleInterest = (interest) => {
    let updatedInterests = { ...allInterests };

    setSelectedInterests((prevSelectedInterests) =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest]
    );

    for (let key in updatedInterests) {
      if (selectedInterests.includes(key)) {
        updatedInterests[key] = 'selected';
      } else {
        updatedInterests[key] = 'notselected';
      }
    }

    storeData('interestList', updatedInterests);
  };

  const [inputs, setInputs] = useState({
    'Weight loss': '',
    'Better sleeping habit': '',
    'Track my nutrition': '',
    'Improve overall fitness': '',
  });

  const handleInputChange = (option, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [option]: value,
    }));
  };

  const options = ['Full Name', 'Email', 'Phone number'];

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

  if (refresh) {
    return <SkeletonLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
          {/* <Text style={styles.headerText}>Dashboard</Text> */}
          {/* <AntDesign name="search1" size={24} color="white" /> */}
          <MaterialCommunityIcons name="menu-open" size={24} color="#222" />

        </View>

        <Card
          style={styles.card}
          onPress={() => navigation.navigate('Quiz')}
        >
          <View style={styles.cardContent}>
            <Image source={require('../assets/avatar.png')} style={styles.avatar} />
            <View style={styles.cardText}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Welcome </Text>
                <AntDesign name="edit" size={24} color="white" />
              </View>
              <Text style={styles.cardSubTitle}>{selectedInterests}</Text>
            </View>
          </View>
        </Card>
      {/* </ImageBackground> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TestAd/>
        <Text style={styles.mainTitle}>Questions to appear on Dashboard</Text>
       

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

        <View style={styles.inputsContainer}>
          <TestAd/>
          {/* {options.map((option, index) => (
            <View key={index} style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={option}
                placeholderTextColor="#888"
                value={inputs[option]}
                onChangeText={(text) => handleInputChange(option, text)}
              />
              {inputs[option] !== '' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  color="#5E5CE6"
                  size={24}
                  style={styles.inputIcon}
                />
              )}
            </View>
          ))} */}

          <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
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
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    marginTop: 8,
    marginBottom: 20,
    alignSelf: 'center',
    height: 80,
    width: Dimensions.get('screen').width - 20,
    backgroundColor: '#5E5CE6',
    justifyContent: 'center',
  },
  cardContent: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardText: {
    marginLeft: 20,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  cardSubTitle: {
    color: '#fff',
  },
  scrollContainer: {
    // padding: 20,
  },
  mainTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    alignSelf: 'center',
  },
  swiper: {
    marginTop: 10,
  },
  interestsContainer: {
    width: Dimensions.get('screen').width, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',

  },
  interestButton: {
    width: '30%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#5E5CE6',
  },
  interestText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#5E5CE6',
  },
  inputsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    padding: 8,
    marginRight: 10,
    color: '#333',
  },
  inputIcon: {
    marginRight: 10,
  },
  loyaltyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf:'center'
  },
  loyaltyPoints: {
    fontSize: 24,
    color: '#5E5CE6',
    marginVertical: 10,
    alignSelf:'center'
  },
  loyaltyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 12,
    borderRadius: 8,
    opacity:0.5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});
