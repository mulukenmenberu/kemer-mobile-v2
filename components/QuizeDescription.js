import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchQuestions } from '../redux/reducers/questionsSlice';
import NoInternetScreen from '../utils/NoInternetScreen';
import SkeletonLoader from '../utils/SkeletonLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestAd } from '../TestAd';

const QuizeDescription = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((state) => state.questions);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [descriptionManagers, setDescriptionManagers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [progressObj, setProgressObj] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // To track the current question

  const { package_id, package_name, tags } = route.params;
let descriptionManagers = []
  const storeAnsweredToAsyncStorage = async (question_id, optionIndex) => {
    try {
      const storedData = JSON.parse(await AsyncStorage.getItem(`${package_id}_${package_name}`)) || {};
      storedData[question_id] = optionIndex;  // Store selected option
      await AsyncStorage.setItem(`${package_id}_${package_name}`, JSON.stringify(storedData));
    } catch (error) {
      console.error("Error storing the quiz progress", error);
    }
  };

  // Load stored progress from AsyncStorage and mark the options
  const loadStoredProgress = async () => {
    try {
      const storedData = JSON.parse(await AsyncStorage.getItem(`${package_id}_${package_name}`));
      setProgressObj(storedData)
      /* if (storedData) {
         console.log(storedData, 'sss')
         const updatedSelections = Array(questions.length).fill(null);
         for (let [questionIndex, optionIndex] of Object.entries(storedData)) {
           updatedSelections[questionIndex] = [parseInt(optionIndex)];
         }
         setSelectedOptions(updatedSelections);
       }*/
    } catch (error) {
      console.error("Error loading stored quiz progress", error);
    }
  };

  useEffect(() => {
    dispatch(fetchQuestions(package_id)); // Fetch questions for the received package_id
  }, [dispatch, package_id]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setSelectedOptions(Array(questions.length).fill(null));
      loadStoredProgress(); // Load progress when questions are loaded

    }
  }, [questions]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const savedPackages = JSON.parse(await AsyncStorage.getItem('savedPackages')) || [];
        setIsFavorite(savedPackages.includes(package_id));
      } catch (error) {
        console.error('Failed to fetch favorite status', error);
      }
    };

    checkFavoriteStatus();
  }, [package_id]);

  const toggleFavorite = async () => {
    try {
      const savedPackages = JSON.parse(await AsyncStorage.getItem('savedPackages')) || [];
      if (isFavorite) {
        // Remove from favorites
        const updatedPackages = savedPackages.filter(id => id !== package_id);
        await AsyncStorage.setItem('savedPackages', JSON.stringify(updatedPackages));
        setIsFavorite(false);
      } else {
        // Add to favorites
        savedPackages.push(package_id);
        await AsyncStorage.setItem('savedPackages', JSON.stringify(savedPackages));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite status', error);
    }
  };

  const selectOption = (questionIndex, optionIndex, question_id) => {
    const updatedSelections = [...selectedOptions];

    // Initialize the selected options array for the current question if not already done
    if (!updatedSelections[questionIndex]) {
      updatedSelections[questionIndex] = [];
    }

    // Check if the option is already selected
    const isAlreadySelected = updatedSelections[questionIndex].includes(optionIndex);

    if (isAlreadySelected) {
      // If the option is already selected, remove it
      updatedSelections[questionIndex] = updatedSelections[questionIndex].filter(
        (selectedOptionIndex) => selectedOptionIndex !== optionIndex
      );
    } else {
      // Otherwise, add the option
      updatedSelections[questionIndex].push(optionIndex);
    }

    setSelectedOptions(updatedSelections);
    storeAnsweredToAsyncStorage(question_id, optionIndex); // Store the progress

  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRefresh(refresh + 1)
    }

  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setRefresh(refresh - 1)

    }
  };
  useEffect(() => {

  }, [refresh])
  if (loading) return <SkeletonLoader />;
  if (error) return <NoInternetScreen />;

  const currentQuestion = questions[currentQuestionIndex];
// console.log(package_id)
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate('Tabs')}>
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
      </TouchableOpacity>

      <View style={styles.fixedHeader}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={styles.tag}>{tags}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <AntDesign name={isFavorite ? "heart" : "hearto"} style={styles.heartIcon} size={16} color="#5E5CE6" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>{package_name}</Text>
        </View>
        <View>
          <Text style={styles.statsText}></Text>
          <Text style={styles.statsTextTotal}>Type: Multiple Choice</Text>
          <Text style={styles.statsTextTotal}>Total Questions: {questions.length}</Text>
        </View>
      </View>

      <TestAd />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentQuestion && (
          <View key={currentQuestion.question_id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestionIndex + 1} {'. ' + currentQuestion.question_text}</Text>
            {[currentQuestion.question_ans1, currentQuestion.question_ans2, currentQuestion.question_ans3, currentQuestion.question_ans4].map((optionText, optionIndex) => {
              if (!optionText) return null; // Skip empty options

              const isCorrect = optionText.endsWith('**');
              const option = { text: optionText.replace('**', ''), correct: isCorrect };
              const isSelected = selectedOptions[currentQuestionIndex]?.includes(optionIndex);
              // const isStored = currentQuestionIndex //d = {"0": 3, "1": 3}
              // const isStored = progressObj.hasOwnProperty(currentQuestion.question_id);
              const isStored = progressObj?.hasOwnProperty(currentQuestion.question_id) || false;
              if (isStored || (isCorrect && isSelected)) {
                descriptionManagers.push(currentQuestion.question_id)
                // setDescriptionManagers((prevDescriptionManagers) => [...prevDescriptionManagers, currentQuestion.question_id]);

              }
              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    // isSelected && (isCorrect ? styles.correctOption : styles.wrongOption),
                    (isSelected || isStored)
                      ? (isCorrect ? styles.correctOption : styles.wrongOption)
                      : null
                  ]}
                  onPress={() => selectOption(currentQuestionIndex, optionIndex, currentQuestion.question_id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      // isSelected && (isCorrect ? styles.correctOptionText : styles.wrongOptionText),
                      (isSelected || isStored)
                        ? (isCorrect ? styles.correctOption : styles.wrongOption)
                        : null
                    ]}
                  >
                    {option.text}
                  </Text>
                  {(isSelected || isStored) && (
                    <MaterialCommunityIcons
                      name={isCorrect ? "check-circle" : "close-circle"}
                      color={isCorrect ? "#2ecc71" : "#FF4D4D"}
                      size={24}
                      style={styles.resultIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {descriptionManagers?.includes(`${currentQuestion?.question_id}`) ? (
          (currentQuestion?.answer_description !==null && currentQuestion?.answer_description !='') && (
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
            <Text style={{ alignSelf: 'left', fontWeight: 'bold', color: '#222' }}>Description</Text>
            <Text style={{ fontFamily: 'monospace', padding: 10, borderRadius: 5, color: '#222' }}>{currentQuestion?.answer_description}</Text>
          </View>)) : ''}
      </ScrollView>


      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={goToPreviousQuestion}
        // disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
          onPress={goToNextQuestion}
        // disabled={currentQuestionIndex === questions.length - 1}
        >
          <Text style={styles.navigationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <StatusBar backgroundColor="#f2f2f2" barStyle="dark-content" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  fixedHeader: {
    marginVertical: 20,
    paddingBottom: 10,
    padding: 20,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'space-between',
  },
  tag: {
    color: '#fff',
    fontSize: 10,
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlign: 'center',
    overflow: 'hidden'
  },
  heartIcon: {
    padding: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  statsText: {
    color: '#5E5CE6',
    fontWeight: 'bold',
  },
  statsTextWrong: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  statsTextTotal: {
    color: '#222',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#E8F0FE',
    borderColor: '#2ecc71',
  },
  wrongOption: {
    backgroundColor: '#FDE8E8',
    borderColor: '#FF4D4D',
  },
  correctOptionText: {
    color: '#2ecc71',
  },
  wrongOptionText: {
    color: '#FF4D4D',
  },
  resultIcon: {
    marginLeft: 10,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  navigationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#5E5CE6',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuizeDescription;
