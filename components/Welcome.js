import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { storeData } from '../data/DB';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';

const Welcome = ({ navigation, setPage, page }) => {
  const dispatch = useDispatch();
  const { departments = [], loading, error } = useSelector((state) => state.departments); // Access the correct state
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { width } = Dimensions.get('screen');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prevSelectedInterests) =>
      prevSelectedInterests.includes(interest)
        ? prevSelectedInterests.filter((item) => item !== interest)
        : [...prevSelectedInterests, interest]
    );
  };

  const saveAndContinue = () => {
    const interestsObject = departments.reduce((acc, department) => {
      acc[department.department_name] = selectedInterests.includes(department.department_name)
        ? 'selected'
        : 'notselected';
      return acc;
    }, {});

    storeData('interestList', interestsObject);
    navigation.navigate('Tabs');

  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentPageIndex = Math.round(offsetX / width);
    setCurrentPage(currentPageIndex);
  };
  // Split departments into chunks of 6
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
  const departmentChunks = chunkArray(departments, 6);


  if (loading) {
    return <SkeletonLoader />
  }

  if (error) {
    return <NoInternetScreen  isLoading={isLoading} setIsLoading={setIsLoading}/>
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIconContainer} onPress={() => setPage(page - 1)}>
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={moderateScale(30)} />
      </TouchableOpacity>

      {/* Placeholder for the icon above the text */}
      <View style={styles.iconContainer}>
        <Image source={require('../assets/logo.png')} style={{ width: horizontalScale(200), height: verticalScale(200) }} />
      </View>

      <ScrollView
      >
        <Text style={styles.title}>Time to customize your level</Text>
        {/* <View style={styles.interestsContainer}> */}
        {/* Custom Swiper for Interests */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // style={styles.swiper}
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
                    size={moderateScale(40)}
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

        <TouchableOpacity style={styles.getStartedButton} onPress={saveAndContinue}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backIconContainer: {
    position: 'absolute',
    top: verticalScale(10),
    left: horizontalScale(10),
  },

  title: {
    fontSize: moderateScale(20),
    color: '#333',
    textAlign: 'center',
    marginVertical: verticalScale(20),
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(100),
    borderRadius: moderateScale(30),
  },
  getStartedButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(100),
    borderRadius: moderateScale(20),
    alignSelf:'center'
    // marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    alignSelf:'center'
  },

  selectedInterest: {
    backgroundColor: '#5E5CE6',
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
  swiper: {
    marginTop: verticalScale(10),
  },
  interestsContainer: {
    width: Dimensions.get('screen').width, // Full width for each page
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
  interestText: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
    color: '#555',
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
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },

});

export default Welcome;
