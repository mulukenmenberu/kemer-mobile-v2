import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import Welcome from './components/Welcome';
import { readData } from './data/DB';
import { horizontalScale, moderateScale, verticalScale } from './utils/Device';
import { rootURL } from './config/baseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const [userIdentifier, setDeviceId] = useState('');
  const [loadingImage, setLoadingImage] = useState(true); // Track image loading state for logo
  const [loadingCharacterImage, setLoadingCharacterImage] = useState(true); // Track loading state for WebP image

  const generateRandomID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomDeviceId = '';
    for (let i = 0; i < 32; i++) {
      randomDeviceId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomDeviceId;
  };

  useEffect(() => {
    const fetchUniqueIdentifier = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('UserIdentifier');
        if (!storedDeviceId) {
          const newDeviceId =  generateRandomID()
          setDeviceId(newDeviceId);
          await AsyncStorage.setItem('UserIdentifier', newDeviceId);
          const userData = { userIdentifier:newDeviceId, username:'' };
          await AsyncStorage.setItem('userInformation', JSON.stringify(userData));

          await saveIdentifier(newDeviceId);
        } else {
          setDeviceId(storedDeviceId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUniqueIdentifier();
  }, []);

  const saveIdentifier = async (userIdentifier) => {
    try {
      const response = await fetch(`${rootURL}users/register_device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdentifier: userIdentifier, full_name: '', email: '' }),
      });
      const result = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const nextPage = () => {
    try {
      readData('interestList')
        .then((data) => {
          let interestsArray = [];
          if (data != null) {
            interestsArray = Object.keys(data).filter((key) => data[key] === "selected");
          }
          if (interestsArray.length > 0) {
            navigation.navigate('Tabs');
          } else {
            setPage(page + 1);
          }
        })
        .catch((err) => {
          setPage(page + 1);
        });
    } catch (err) {
      console.error(err);
    }
  };

  if (page === 1) return <Welcome navigation={navigation} setPage={setPage} page={page} />;

  return (
    <View style={styles.container}>
      {/* Icon at the top */}
      <View style={styles.iconContainer}>
        <Image 
          source={require('./assets/logo.png')} 
          style={{ width: horizontalScale(200), height: verticalScale(200) }}
          onLoadStart={() => setLoadingImage(true)} // Start loading
          onLoadEnd={() => setLoadingImage(false)} // Finish loading
          onError={(error) => {
            setLoadingImage(false); // Handle error
            console.error(error);
          }}
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.titleText}>ቀመር ሞባይል</Text>
      <Text style={styles.subtitleText}>
        Learn by completing numerous questions, all presented in a clear and engaging format.
      </Text>

      {/* Running Characters (WebP Image) */}
      <View style={styles.imageContainer}>
        {loadingCharacterImage ? (
          <Text>Loading image...</Text>  // Display a loading indicator while image loads
        ) : null}
        <Image 
          source={require('./assets/img.webp')} 
          style={styles.characterImage}
          onLoadStart={() => setLoadingCharacterImage(true)} // Start loading the WebP image
          onLoadEnd={() => setLoadingCharacterImage(false)}  // Finish loading the WebP image
          onError={(error) => {
            setLoadingCharacterImage(false);  // Set loading to false if error occurs
            console.error('Error loading WebP image', error);
          }}
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.getStartedButton} onPress={() => nextPage()}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}></Text>
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
  iconContainer: {},
  welcomeText: {
    fontSize: moderateScale(18),
    color: '#333',
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
    marginTop:verticalScale(30)
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
