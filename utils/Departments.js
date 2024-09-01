import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/reducers/departmentsSlice';

const Departments = ({ navigation }) => {
  const dispatch = useDispatch();
  const { departments = [], loading, error } = useSelector((state) => state.departments); // Access the correct state
  const [selectedInterests, setSelectedInterests] = useState([]);

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.interestsContainer}>
      {departments.map((interest, index) => ( // Use 'departments' here
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
  );
};

const styles = StyleSheet.create({
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedInterest: {
    backgroundColor: '#5E5CE6',
  },
  interestText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
});

export default Departments;
