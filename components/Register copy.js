import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    'Weight loss',
    'Better sleeping habit',
    'Track my nutrition',
    'Improve overall fitness',
  ];

  const selectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate('Welcome')}>
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
      </TouchableOpacity>

      {/* Placeholder for the icon above the text */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="chart-line-variant" color={"purple"} size={80} />
      </View>

      <Text style={styles.title}>Let us know how we can help you</Text>
      <Text style={styles.subtitle}>You always can change this later</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => selectOption(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
            {selectedOption === option && (
              <MaterialCommunityIcons
                name="check-circle"
                color="#5E5CE6"
                size={24}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  iconContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginVertical: 8,
  },
  selectedOption: {
    backgroundColor: '#E8E1FF',
    borderWidth: 1,
    borderColor: '#5E5CE6',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#5E5CE6',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: '#5E5CE6',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;
