import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/Device';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../../redux/reducers/notesSlice';
import SkeletonLoaderReader from '../../utils/SkeletonLoaderReader';
import { AdComponent } from '../../AdComponent';
const dataInit = [];

const ReadText = ({ selectedTopic, selectedCourse }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(dataInit)
  
  const { notes, loadings2, errors2 } = useSelector((state) => state.subjects);

  useEffect(() => {
    dispatch(fetchNotes({ selectedCourse, selectedTopic })).then((response) => {
      setData(response.payload)
      // setRefreshing(false) 
    })
  }, [])
if(loadings2){return <SkeletonLoaderReader/>}
  return (
    <ScrollView style={styles.container}>
      {data.map((page, index) => (
        <View key={page.id} style={styles.page}>
          <Text style={styles.header}>{page.subtopic}</Text>
          <Text style={styles.text}>{page.content}</Text>
          <View style={styles.pageNumberContainer}>
            <Text style={styles.pageNumber}>Page {index + 1}</Text>
          </View>
        </View>
      ))}
      
      {Array.isArray(data) && data.length > 0 ? (<AdComponent />):''}
      <View style={{ marginTop: verticalScale(140), marginBottom:verticalScale(110) }}>
      
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  page: {
    padding: 20,
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
    backgroundColor: '#fff',
    marginHorizontal: horizontalScale(20),
    borderRadius: moderateScale(10),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative', // Allows for absolute positioning of the page number
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3ac569',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    color: '#2e78f0',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  pageNumberContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20, // Align page number to the right
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic', // Optional styling for the page number
  },
});

export default ReadText;
