import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Welcome from './components/Welcome';
import { readData } from './data/DB';
import { horizontalScale, moderateScale, verticalScale } from './utils/Device';

const Splash = ({ navigation }) => {
  const [page, setPage] = useState(0)


  const nextPage = () => {
    readData('interestList')
      .then((data) => {
        const interestsArray = Object.keys(data).filter((key) => data[key] === "selected");
        if (interestsArray.length > 0) {
          navigation.navigate('Tabs');
        } else {
          setPage(page + 1);
        }
      })
      .catch((err) => {
        console.error(err);  // Log the error for debugging
        setPage(page + 1);
      });
  }
  

  if (page == 1) return <Welcome navigation={navigation} setPage={setPage} page={page} />
  return (
    <View style={styles.container}>
      {/* Icon at the top */}
      <View style={styles.iconContainer}>
        <Image source={require('./assets/logo.png')} style={{ width: horizontalScale(200), height: verticalScale(200) }} />

      </View>

      {/* Welcome Text */}
      <Text style={styles.titleText}>ቀለም ሞባይል</Text>
      <Text style={styles.subtitleText}>
        Learn by completing numerous questions, all presented in a clear and engaging format.
      </Text>

      {/* Running Characters */}
      <View style={styles.imageContainer}>
        {/* Replace with your character images */}
        <Image source={require('./assets/img.webp')} style={styles.characterImage} />
        {/* <Image source={require('./assets/character2.png')} style={styles.characterImage} /> */}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.getStartedButton} onPress={() => nextPage()}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        {/* Already have an account? <Text style={styles.signInLink}>Sign in</Text> */}
      </Text>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(20),
  },
  iconContainer: {
    // marginTop: 30,
  },
  icon: {
    width: horizontalScale(50),
    height: verticalScale(50),
  },
  welcomeText: {
    fontSize: moderateScale(18),
    color: '#333',
    // marginTop: 20,
  },
  titleText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: moderateScale(14),
    color: '#777',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: verticalScale(10),
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30,
  },
  characterImage: {
    width: "100%",
    height: verticalScale(300),
    marginHorizontal: horizontalScale(10),
  },
  getStartedButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(100),
    borderRadius: moderateScale(20),
    // marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: verticalScale(16),
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: moderateScale(20),
    color: '#777',
  },
  signInLink: {
    color: '#5E5CE6',
    fontWeight: 'bold',
  },
});

export default Splash;
