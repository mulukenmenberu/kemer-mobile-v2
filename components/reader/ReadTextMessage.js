import React from 'react';
import { View, Text, StyleSheet, Dimensions , RefreshControl, ScrollView} from 'react-native';
import { verticalScale } from '../../utils/Device';

const ReadTextMessage = ({ messageText, onRefresh, refreshing }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
         refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text style={styles.header}>{messageText}</Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes sure the container takes up the full height of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: 'white',
    // marginTop:"10%",
    
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dfdfdf',
    textAlign: 'center', // Centers text within the Text component
    marginTop: "50%"
  },
});

export default ReadTextMessage;
