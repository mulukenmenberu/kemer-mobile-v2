import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TestAd } from '../TestAd';

const ExamMode = ({ route, navigation }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [progressObj, setProgressObj] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // To track the current question

  const { package_id, package_name, tags, question_data } = route.params;
  const questions = question_data
  let descriptionManagers = []



  
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
  // if (loading) return <SkeletonLoader />;
  // if (error) return <NoInternetScreen />;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate('Tabs')}>
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
      </TouchableOpacity>

      <View style={styles.fixedHeader}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={styles.tag}>{tags}</Text>

          </View>
          <Text style={styles.subtitle}>{package_name}</Text>
        </View>
        <View>
          <Text style={styles.statsText}>Correct: {correctAnswers}</Text>
          <Text style={styles.statsTextWrong}>Wrong: {' ' + wrongAnswers}</Text>
          <Text style={styles.statsTextTotal}>Total Q: {questions.length}</Text>
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
              const isStored = progressObj?.hasOwnProperty(currentQuestion.question_id) || false;
              if (isStored || (isCorrect && isSelected)) {
                descriptionManagers.push(currentQuestion.question_id)

              }
              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    (isSelected || isStored)
                      ? (isCorrect ? styles.correctOption : styles.wrongOption)
                      : null
                  ]}
                  onPress={() => selectOption(currentQuestionIndex, optionIndex, currentQuestion.question_id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (isSelected || isStored)
                        ? (isCorrect ? styles.correctOption : styles.wrongOption)
                        : null
                    ]}
                  >
                    {option.text}
                  </Text>
                
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </ScrollView>


      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={goToPreviousQuestion}
        >
          <Text style={styles.navigationButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navigationButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
          onPress={goToNextQuestion}
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
    borderColor: '#AE5CE6',
  },
  wrongOption: {
    backgroundColor: '#E8F0FE',
    borderColor: '#AE5CE6',
  },
  correctOptionText: {
    color: '#AE5CE6',
  },
  wrongOptionText: {
    color: '#AE5CE6',
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

export default ExamMode;
