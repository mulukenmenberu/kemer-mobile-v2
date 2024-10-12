import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { fetchExamMode } from '../redux/reducers/examModeSlice';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { rootURL } from '../config/baseApi';
import { readData } from '../data/DB';

const ExamModeModal = ({visible, setVisible, showModal, hideModal, navigation }) => {
    const [textInputs, setTextInputs] = useState([{ id: 1, value: '', hasError: false }]);
    const [exam_loaddr, setExamLoader] = useState(false);
    // const [visible, setVisible] = useState(false);

    // const showModal = () => setVisible(true);
    // const hideModal = () => {
    //     if (!exam_loaddr) {
    //         setVisible(false);
    //     }
    // }
    const containerStyle = { backgroundColor: '#f5f5f5', padding: 20, marginTop: verticalScale(-70), width: '90%', alignSelf: 'center', borderRadius: moderateScale(15) };
    const dispatch = useDispatch();
    const { examMode, loadingg, errorr } = useSelector((state) => state.examMode);
    const addTextInput = () => {
        const updatedInputs = textInputs.map(input =>
            input.value.trim() === '' ? { ...input, hasError: true } : { ...input, hasError: false }
        );

        const hasEmptyInput = updatedInputs.some(input => input.hasError);
        if (!hasEmptyInput) {
            setTextInputs([...textInputs, { id: textInputs.length + 1, value: '', hasError: false }]);
        } else {
            setTextInputs(updatedInputs);
        }
    };

    const removeTextInput = (id) => {
        setTextInputs(textInputs.filter(input => input.id !== id));
    };

    const handleTextChange = (id, newValue) => {
        setTextInputs(textInputs.map(input =>
            input.id === id ? { ...input, value: newValue, hasError: newValue.trim() === '' } : input
        ));
    };
    const generateExamMode = async () => {
        setExamLoader(true)
        let responseMessage = 0
        try {
            const response = await fetch(`${rootURL}users/check_usernames.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(textInputs)
            });

            if (!response.ok) {
                setExamLoader(false)
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setTextInputs(result)

            result.forEach(item => {
                if (item.hasError) {
                    responseMessage++
                    //   console.log(`User ${item.value} not found, set error state for this field.`);
                } else {
                    //   console.log(`User ${item.value} is valid.`);
                }
            });

            if (responseMessage <= 0) {
                setExamLoader(true)
                readData('interestList').then((data) => {

                    const interestsArray = Object.keys(data)
                        .filter((key) => data[key] === "selected")
                    // .join(' - '); 
                    const userNames = textInputs.map(item => item.value);

                    // console.log(userNames, interestsArray)
                    dispatch(fetchExamMode({ interestsArray, userNames })).then((response) => {
                        navigation.navigate('ExamMode', {
                            package_id: 1,
                            question_data: response.payload,
                            package_name: "Model Exam",
                            tags: "",
                        })

                        setVisible(false);
                        setExamLoader(false)

                    })
                });
            } else {
                setExamLoader(false)
            }
        } catch (error) {
            setExamLoader(false)
            //   console.error('There was a problem with the fetch operation:', error);
        }
        return responseMessage
    };
  return (
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
    <Text style={styles.tag}>{"Exam Mode"}</Text>
    <Text style={{color:'#222', fontWeight: 'bold', alignSelf: 'center', alignContent: 'center', fontSize: moderateScale(18) }}>
        Get a random set of questions and test your understanding in exam mode
    </Text>
    {!exam_loaddr ? (
        <>
            <Text style={styles.tag}>{"Fun with friends"}</Text>

            <Text style={{color:'#222', fontWeight: 'bold', alignSelf: 'center', alignContent: 'center', fontSize: moderateScale(17), marginTop: verticalScale(10) }}>
                Invite users to join this challenge <Text style={{ color: 'green' }}>and make it Fun </Text>
            </Text>

            {/* Dynamic text boxes with add and remove feature */}
            {Array.isArray(textInputs) && textInputs.map((input, index) => (
                <View  key={input.id}>
                    <View key={input.id} style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: input.hasError ? 'red' : 'gray',
                                borderRadius: 10,
                                padding: 10,
                                flex: 1,
                                color: '#222',
                                fontSize: 16,
                                // shadowColor: '#000',
                                shadowOpacity: 0.8,
                                shadowRadius: 2,
                            }}
                            placeholder="Type Username (optional)"
                            value={input.value}
                            onChangeText={(text) => handleTextChange(input.id, text)}
                        />


                        <AntDesign
                            name="delete"
                            size={moderateScale(24)}
                            color={(textInputs.length <= 1 && index <= 0) ? '#6a6a6a' : 'red'} // Set color based on condition
                            onPress={(textInputs.length <= 1 && index <= 0) ? null : () => removeTextInput(input.id)} // Set onPress conditionally
                            style={{
                                marginLeft: 10,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 5,
                                justifyContent: 'center',
                            }}
                        />

                    </View>
                    {input.hasError && <Text style={{ color: 'red' }}>Invalid username</Text>}
                </View>
            ))}

            <TouchableOpacity
                onPress={addTextInput}
                style={{
                    alignSelf: 'center',
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(10),
                    backgroundColor: '#007BFF',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5,
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>+ Add User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.getStartedButton} onPress={() => generateExamMode()}>
                <Text style={styles.buttonText}>Generate Model Exam</Text>
            </TouchableOpacity>
        </>
    ) : (
        <TouchableOpacity style={styles.getStartedButton2}>
            <Text style={styles.buttonText}>Please wait</Text>
        </TouchableOpacity>
    )}
</Modal>

  );
};

const styles = StyleSheet.create({
    container: {

    },
    getStartedButton: {
        backgroundColor: '#5E5CE6',
        height: 50,
        justifyContent: 'center',
        borderRadius: moderateScale(10),
    },
    getStartedButton2: {
        backgroundColor: '#5E5CA6',
        height: 50,
        justifyContent: 'center',
        borderRadius: moderateScale(10),
    },
    buttonText: {
        color: '#fff',
        fontSize: verticalScale(16),
        fontWeight: 'bold',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    tag: {
        color: '#fff',
        fontSize: 10,
        backgroundColor: '#FF6347',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: "30%",
        textAlign: 'center',
        overflow: 'hidden'
    },
});

export default ExamModeModal;
