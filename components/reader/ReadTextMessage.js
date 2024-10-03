import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { verticalScale } from '../../utils/Device';

const ReadTextMessage = ({messageText}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{messageText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes sure the container takes up the full height of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: 'white',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dfdfdf',
    textAlign: 'center', // Centers text within the Text component
    marginTop: verticalScale(160)
  },
});

export default ReadTextMessage;
