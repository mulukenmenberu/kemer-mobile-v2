import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { storeData } from '../data/DB';
import SkeletonLoader from '../utils/SkeletonLoader';
import NoInternetScreen from '../utils/NoInternetScreen';

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
    console.log(interestsObject);
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
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
      </TouchableOpacity>

      {/* Placeholder for the icon above the text */}
      <View style={styles.iconContainer}>
        <Image source={require('../assets/logo.png')} style={{ width: 200, height: 200 }} />
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
    top: 10,
    left: 10,
  },

  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  getStartedButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 20,
    alignSelf:'center'
    // marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
  swiper: {
    marginTop: 10,
  },
  interestsContainer: {
    width: Dimensions.get('screen').width, // Full width for each page
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
  interestText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
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
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

});

export default Welcome;
