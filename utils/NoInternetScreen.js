import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NoInternetScreen = ({navigation, isLoading, setIsLoading}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
    
        <MaterialIcons name="portable-wifi-off" size={104}  color="#5E5CE6" />

      </View>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.subtitle}>No internet connection!</Text>
      <Text style={styles.message}>
        Something went wrong. Try refreshing the page or checking your internet connection. We’ll see you in a moment!
      </Text>
      <TouchableOpacity style={styles.button} onPress={()=>setIsLoading(!isLoading)}>
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
      <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f2f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cross: {
    fontSize: 50,
    color: '#5E5CE6',
    marginRight: 10,
  },
  curve: {
    width: 40,
    height: 10,
    backgroundColor: '#5E5CE6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    transform: [{ rotate: '45deg' }],
  },
  curveSmall: {
    width: 20,
    height: 5,
    transform: [{ rotate: '30deg' }],
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5E5CE6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoInternetScreen;
