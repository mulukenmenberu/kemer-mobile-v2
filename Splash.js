import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Welcome from './components/Welcome';
import { readData } from './data/DB';
import { horizontalScale, moderateScale, verticalScale } from './utils/Device';
import DeviceInfo from 'react-native-device-info';
import { rootURL } from './config/baseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const [deviceId, setDeviceId] = useState('');
  const [loadingImage, setLoadingImage] = useState(true); // Track image loading state

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem('deviceID');
        if (!storedDeviceId) {
          const newDeviceId = await DeviceInfo.getUniqueId();
          setDeviceId(newDeviceId);
          await AsyncStorage.setItem('deviceID', newDeviceId);
          await saveDeviceIdToServer(newDeviceId);
        } else {
          setDeviceId(storedDeviceId);
        }
      } catch (error) {
      }
    };

    fetchDeviceId();
  }, []);

  const saveDeviceIdToServer = async (deviceId) => {
    try {
      const response = await fetch(`${rootURL}users/register_device.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId, full_name: '', email: '' }),
      });
      const result = await response.json();
    } catch (error) {
    }
  };

  const nextPage = () => {
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
  };

  if (page === 1) return <Welcome navigation={navigation} setPage={setPage} page={page} />;

  return (
    <View style={styles.container}>
      {/* Icon at the top */}
      <View style={styles.iconContainer}>
        <Image 
          source={require('./assets/logo.png')} 
          style={{ width: horizontalScale(200), height: verticalScale(200) }}
          onLoadEnd={() => setLoadingImage(false)} // Update loading state
          onError={(error) => {
            setLoadingImage(false); // Set loading to false even if error occurs
          }}
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.titleText}>ቀመር ሞባይል</Text>
      <Text style={styles.subtitleText}>
        Learn by completing numerous questions, all presented in a clear and engaging format.
      </Text>

      {/* Running Characters */}
      <View style={styles.imageContainer}>
        <Image source={require('./assets/img.webp')} style={styles.characterImage} />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.getStartedButton} onPress={() => nextPage()}>
        <Text style={styles.buttonText}>Get Started</Text>
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
