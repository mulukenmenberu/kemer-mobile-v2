import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale, verticalScale } from '../utils/Device';
// import { InterestialAd } from '../InterestialAd';

const ExamMode = ({ route, navigation }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // Added for review mode
  // const [showInterestialAd, setShowInterestialAd] = useState(false);

  const { package_id, package_name, tags, question_data } = route.params;
  const questions = question_data;

  const [countedAnswers, setCountedAnswers] = useState({});

  const selectOption = (questionIndex, optionIndex, isCorrect) => {
    if (reviewMode) return; // Disable selection in review mode

    const updatedSelections = [...selectedOptions];
    updatedSelections[questionIndex] = optionIndex;

    const previouslySelectedOption = selectedOptions[questionIndex];
    const isPreviouslyCorrect = questions[questionIndex][`question_ans${previouslySelectedOption + 1}`]?.endsWith('**');

    if (countedAnswers[questionIndex]) {
      if (isPreviouslyCorrect) {
        setCorrectAnswers((prev) => prev - 1);
      } else {
        setWrongAnswers((prev) => prev - 1);
      }
    }

    setSelectedOptions(updatedSelections);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    setCountedAnswers((prev) => ({
      ...prev,
      [questionIndex]: true,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    if((currentQuestionIndex+1) %33 ==0){
      // setShowInterestialAd(true)
    }else if((currentQuestionIndex+1) %33 !=0){
      // setShowInterestialAd(false)

    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const showResults = () => {
    setShowResult(true);
  };

  const reviewAnswers = () => {
    setShowResult(false);  // Go back to question one
    setReviewMode(true);   // Enter review mode
    setCurrentQuestionIndex(0); // Go to the first question
  };
  const handleAdClose = () => {
    // setShowInterestialAd(false);
  };
  
  useEffect(()=>{

    if(currentQuestionIndex<=0){
      // setShowInterestialAd(true)

    }
  },[])
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate('Tabs')}>
        <MaterialCommunityIcons name="arrow-left" color={"#333"} size={30} />
      </TouchableOpacity>

      <View style={styles.fixedHeader}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={styles.tag}>{package_name}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.subtitle}>{"No time limit (" + questions.length + ' Questions)'}</Text>
        </View>
      </View>

      {/* <AdComponent /> */}

      {/* <InterestialAd condition={showInterestialAd} onAdClose={handleAdClose}/> */}


      {!showResult && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {currentQuestion && (
            <View key={currentQuestion.question_id} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {currentQuestionIndex + 1} {'. ' + currentQuestion.question_text}
              </Text>
              {[currentQuestion.question_ans1, currentQuestion.question_ans2, currentQuestion.question_ans3, currentQuestion.question_ans4].map((optionText, optionIndex) => {
                if (!optionText) return null;

                const isCorrect = optionText.endsWith('**');
                const option = { text: optionText.replace('**', ''), correct: isCorrect };
                const isSelected = selectedOptions[currentQuestionIndex] === optionIndex;

                const optionStyleold = reviewMode
                  ? (isSelected
                    ? (isCorrect ? styles.correctOption : styles.wrongOption)
                    : (isCorrect ? styles.correctOption : null))
                  : (isSelected ? (isCorrect ? styles.correctOption : styles.wrongOption) : null);

                const optionStyle = reviewMode
                  ? (isSelected
                    ? (isCorrect ? styles.correctOptionShow : styles.wrongOptionShow)
                    : (isCorrect ? styles.correctOptionShow : null))
                  : (isSelected ? (isCorrect ? styles.correctOption : styles.wrongOption) : null);


                return (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[styles.optionButton, optionStyle]}
                    onPress={() => selectOption(currentQuestionIndex, optionIndex, isCorrect)}
                    disabled={reviewMode} // Disable in review mode
                  >
                    <Text style={[styles.optionText, optionStyle]}>
                      {option.text}
                    </Text>
                    {((isSelected && reviewMode) || (reviewMode && isCorrect)) && (
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
        </ScrollView>
      )}

      {showResult && (
        <View>
          <Text style={{ fontWeight: 'bold', paddingLeft: moderateScale(20), fontSize: moderateScale(15), paddingBottom: 5 }}>Exam Result</Text>
          <View style={{ alignSelf: 'center', marginBottom: 50, width: '90%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', color: '#333' }}>Correct Answers:</Text>
              <Text style={{ fontWeight: 'bold', color: '#28a745' }}>{correctAnswers}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', color: '#333' }}>Wrong Answers:</Text>
              <Text style={{ fontWeight: 'bold', color: '#dc3545' }}>{' ' + wrongAnswers}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', color: '#333' }}>Unanswered Questions:</Text>
              <Text style={{ fontWeight: 'bold', color: '#dc3545' }}>{' ' + (questions.length - (wrongAnswers + correctAnswers))}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
              <Text style={{ fontWeight: 'bold', color: '#333' }}>Total Questions:</Text>
              <Text style={{ fontWeight: 'bold', color: '#17a2b8' }}>{questions.length}</Text>
            </View>
          </View>

          {currentQuestionIndex === questions.length - 1 && (
            <TouchableOpacity style={styles.navigationButtonResultReview} onPress={reviewAnswers}>
              <Text style={styles.navigationButtonText}>Review Answers</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {currentQuestionIndex === questions.length - 1 && !showResult && (
        <TouchableOpacity style={styles.navigationButtonResult} onPress={showResults}>
          <Text style={styles.navigationButtonText}>Show Result</Text>
        </TouchableOpacity>
      )}

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
    borderColor: '#E8F0FE',
  },
  wrongOption: {
    backgroundColor: '#E8F0FE',
    borderColor: '#E8F0FE',
  },
  correctOptionShow: {
    backgroundColor: '#E8F0FE',
    borderColor: '#2ecc71',
    color:'#222'
  },
  wrongOptionShow: {
    backgroundColor: '#E8F0FE',
    borderColor: '#FF4D4D',
    color:'#222'

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
  navigationButtonResult: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "95%",
    alignSelf: 'center',
    marginBottom: verticalScale(30),
    borderRadius: 8,
    backgroundColor: '#FF6347',
  },
  navigationButtonResultReview: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "95%",
    alignSelf: 'center',
    marginBottom: verticalScale(30),
    borderRadius: 8,
    backgroundColor: '#FF6347',
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
