import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/Device';

const data = [
  {
    id: 1,
    header: "The New ‘use’ Hook",
    content: `The use hook can fetch and utilize resources like Promises or context directly within components, even inside loops and conditional statements.
    
    It’s designed to simplify the process of fetching and consuming asynchronous data within your components. It allows you to handle resources directly in your render logic, making it easier to deal with asynchronous operations such as data fetching, waiting for data to load, and handling errors. Here is a simple example and explanation of how to use the use hook.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Vestibulum ut magna blandit, aliquam odio sed, porta velit. Fusce at tincidunt nisl. Nulla facilisi. Donec ultricies nec justo sit amet convallis.`
  },
  {
    id: 2,
    header: "How to use the ‘use’ Hook",
    content: `The following example demonstrates the use of the ‘use’ hook:
    
    import React, { use } from 'react';

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Vestibulum ut magna blandit, aliquam odio sed, porta velit. Fusce at tincidunt nisl. Nulla facilisi. Donec ultricies nec justo sit amet convallis.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Vestibulum ut magna blandit, aliquam odio sed, porta velit. Fusce at tincidunt nisl. Nulla facilisi. Donec ultricies nec justo sit amet convallis.`
  },
  {
    id: 3,
    header: "Practical Example",
    content: `Let's see how the use hook works in a real scenario:
    
    const data = use(fetchData());

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet lectus nulla. Cras venenatis ligula sed ligula tristique, a tincidunt urna consequat. Duis ut arcu sem. Vivamus venenatis enim ac velit placerat, eget commodo mauris ullamcorper.`
  },
  {
    id: 4,
    header: "Mathematical Equation Example",
    content: `This is an example of a mathematical equation (Quadratic Formula):
    
    x = (-b ± √(b² - 4ac)) / 2a`
  },
  {
    id: 5,
    header: "Chemical Formula Example",
    content: `This is an example of a chemical formula:
    
    H₂O (Water), CO₂ (Carbon Dioxide)`
  }
];

const ReadText = ({selectedTopic, selectedCourse}) => {
  useEffect(()=>{
console.log(selectedTopic, selectedCourse, "hh")
  },[])

  return (
    <ScrollView style={styles.container}>
      {data.map((page, index) => (
        <View key={page.id} style={styles.page}>
          <Text style={styles.header}>{page.header}</Text>
          <Text style={styles.text}>{page.content}</Text>
          <View style={styles.pageNumberContainer}>
            <Text style={styles.pageNumber}>Page {index + 1}</Text>
          </View>
        </View>
      ))}
      <View  style={{marginTop:verticalScale(140)}}></View>
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
    marginHorizontal:horizontalScale(20),
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
