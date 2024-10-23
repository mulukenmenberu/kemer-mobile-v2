import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchQuestions } from '../redux/reducers/questionsSlice';
import NoInternetScreen from '../utils/NoInternetScreen';
import SkeletonLoader from '../utils/SkeletonLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdComponent } from '../AdComponent';
import { horizontalScale, moderateScale } from '../utils/Device';
import { InterestialAd } from '../InterestialAd';

const QuizeDescription = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((state) => state.questions);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInterestialAd, setShowInterestialAd] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [progressObj, setProgressObj] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([]);

  const { package_id, package_name, tags } = route.params;

  let descriptionManagers = [];

  const storeAnsweredToAsyncStorage = async (question_id, optionIndex, deleteData = false) => {
    if (deleteData) {
      try {
        // const storedData = JSON.parse(await AsyncStorage.getItem(`${package_id}_${package_name}`)) || {};
        // storedData[question_id] = optionIndex;
        await AsyncStorage.removeItem(`${package_id}_${package_name}`);
      } catch (error) {
        
      }
    } else {
      try {
        const storedData = JSON.parse(await AsyncStorage.getItem(`${package_id}_${package_name}`)) || {};
        storedData[question_id] = optionIndex;
        await AsyncStorage.setItem(`${package_id}_${package_name}`, JSON.stringify(storedData));
      } catch (error) {
        
      }
    }
  };

  const loadStoredProgress = async () => {
    try {
      const storedData = JSON.parse(await AsyncStorage.getItem(`${package_id}_${package_name}`));
      setProgressObj(storedData);
    } catch (error) {
      console.error("Error loading stored quiz progress", error);
    }
  };

  useEffect(() => {
    dispatch(fetchQuestions(package_id));
  }, [dispatch, package_id]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setSelectedOptions(Array(questions.length).fill(null));
      loadStoredProgress();
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
        const updatedPackages = savedPackages.filter(id => id !== package_id);
        await AsyncStorage.setItem('savedPackages', JSON.stringify(updatedPackages));
        setIsFavorite(false);
      } else {
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

    if (!updatedSelections[questionIndex]) {
      updatedSelections[questionIndex] = [];
    }

    const isAlreadySelected = updatedSelections[questionIndex].includes(optionIndex);

    if (isAlreadySelected) {
      updatedSelections[questionIndex] = updatedSelections[questionIndex].filter(
        (selectedOptionIndex) => selectedOptionIndex !== optionIndex
      );
    } else {
      updatedSelections[questionIndex].push(optionIndex);
    }

    setSelectedOptions(updatedSelections);
    storeAnsweredToAsyncStorage(question_id, optionIndex, false);
  };



  if (loading) return <SkeletonLoader />;
  if (error) return <NoInternetScreen />;

  // const currentQuestion = questions[currentQuestionIndex];
  const uniqueChapters = [...new Set(questions.map(question => question.chapter))];

  // Function to toggle chapter selection
  const toggleChapterSelection = (chapter) => {
    setSelectedChapters(prev =>
      prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
    );
  };

  // Filter questions based on selected chapters
  const filteredQuestions = selectedChapters.length > 0
    ? questions.filter(question => selectedChapters.includes(question.chapter))
    : questions;
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRefresh(refresh + 1);
    }
    if((currentQuestionIndex+1) %45 ==0){
      setShowInterestialAd(true)
    }else if((currentQuestionIndex+1) %45 !=0){
      setShowInterestialAd(false)

    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setRefresh(refresh - 1);
    }
  };
  const resetProgress = () => {
    Alert.alert(
      "Confirm Reset",  // Title of the alert
      "Are you sure you want to reset your progress?",  // Message of the alert
      [
        {
          text: "No", // Option for No
          onPress: () => console.log(" "), // Action when No is clicked
          style: "cancel",  // Style of the No button
        },
        {
          text: "Yes", // Option for Yes
          onPress: () => {
            storeAnsweredToAsyncStorage(0, 0, true);
            setSelectedOptions([])
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(0);
              setRefresh(refresh - 1);
            }
          }, // Proceed when Yes is clicked
        },
      ],
      { cancelable: false } // Makes the alert not dismissible by clicking outside
    );
  };
    // Handle resetting after the ad closes
    const handleAdClose = () => {
      setShowInterestialAd(false);
    };
  
  return (
    <SafeAreaView style={styles.container}>
      {uniqueChapters.length <= 1 &&

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
            <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => resetProgress()}>
            <MaterialCommunityIcons name="lock-reset" color={"#333"} size={30} />
          </TouchableOpacity>
        </View>
      }
      {/* currentQuestionIndex === 0 */}

      {uniqueChapters.length > 1 && <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
          <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => resetProgress()} style={{ marginRight: horizontalScale(10) }}>
            <MaterialCommunityIcons name="lock-reset" color={"#333"} size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="filter-variant-minus" color={"#333"} size={30} />
          </TouchableOpacity>
        </View>
      </View>}


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
          <Text style={styles.statsTextTotal}>Total Questions: {filteredQuestions.length}</Text>
        </View>
      </View>

      {/* <AdComponent /> */}
      <InterestialAd condition={showInterestialAd} onAdClose={handleAdClose}/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentQuestion && (
          <View key={currentQuestion.question_id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestionIndex + 1} {'. ' + currentQuestion.question_text}</Text>
            {[currentQuestion.question_ans1, currentQuestion.question_ans2, currentQuestion.question_ans3, currentQuestion.question_ans4].map((optionText, optionIndex) => {
              if (!optionText) return null; // Skip empty options

              const isCorrect = optionText.endsWith('**');
              const option = { text: optionText.replace('**', ''), correct: isCorrect };
              const isSelected = selectedOptions[currentQuestionIndex]?.includes(optionIndex);
              const isStored = progressObj?.hasOwnProperty(currentQuestion.question_id) || false;
              if (isStored || (isCorrect && isSelected)) {
                descriptionManagers.push(currentQuestion.question_id);
              }
              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    (isSelected || isStored) ? (isCorrect ? styles.correctOption : styles.wrongOption) : null
                  ]}
                  onPress={() => selectOption(currentQuestionIndex, optionIndex, currentQuestion.question_id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (isSelected || isStored) ? (isCorrect ? styles.correctOption : styles.wrongOption) : null
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
          (currentQuestion?.answer_description !== null && currentQuestion?.answer_description !== '') && (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
              <Text style={{ alignSelf: 'left', fontWeight: 'bold', color: '#222' }}>Description</Text>
              <Text style={{ fontFamily: 'monospace', padding: 10, borderRadius: 5, color: '#222' }}>{currentQuestion?.answer_description}</Text>
            </View>
          )) : ''}
      </ScrollView>

      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={goToPreviousQuestion}
        >
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === filteredQuestions.length - 1 && styles.disabledButton]}
          onPress={goToNextQuestion}
        >
          <Text style={styles.navigationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Chapter Filtering */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, styles.tagheader]}>Select Chapters</Text>
            {uniqueChapters.map((chapter, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.chapterButton, selectedChapters.includes(chapter) && styles.selectedChapterButton, , index % 2 === 0 ? styles.evenCard : styles.oddCard]}
                onPress={() => toggleChapterSelection(chapter)}
              >
                <Text style={[styles.chapterButtonText, selectedChapters.includes(chapter) && styles.selectedText]}>{index + 1}. {chapter}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
    overflow: 'hidden',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chapterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    // alignItems: 'center',
  },
  selectedChapterButton: {
    backgroundColor: '#5E5CE6',
    borderColor: '#5E5CE6',
  },
  chapterButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#5E5CE6'
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tagheader: {
    color: '#fff',
    fontSize: moderateScale(18),
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: "100%",
    textAlign: 'center',
    overflow: 'hidden',
  },
  evenCard: {
    backgroundColor: '#f0f0f0', // Light gray for even rows
  },
  oddCard: {
    backgroundColor: '#ffffff', // White for odd rows
  },
});

export default QuizeDescription;
