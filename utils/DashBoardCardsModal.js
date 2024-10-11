import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { Modal } from 'react-native-paper';

const DashBoardCardsModal = ({ visible, setVisible, hideModal, navigation, courses, setActive }) => {

    const containerStyle = { 
        backgroundColor: '#f5f5f5', 
        padding: 20, 
        marginTop: verticalScale(-70), 
        width: '90%', 
        alignSelf: 'center', 
        borderRadius: moderateScale(15) 
    };

    const setSelection = (course_id) => {
        setVisible(false);
        setActive(course_id);
    }

    return (
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <Text style={styles.tag}>{"Select Courses to get list of question packages"}</Text>
          

            <View style={styles.cardContainer}>
                {courses.map((course) => (
                    <TouchableOpacity 
                        key={course.course_id} 
                        onPress={() => setSelection(course.course_id)} 
                        style={styles.card}
                    >
                        <Text style={styles.cardTitle}>{course.course_name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tag: {
        color: '#fff',
        fontSize: 10,
        backgroundColor: '#FF6347',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        width: "100%",
        textAlign: 'center',
        overflow: 'hidden'
    },
    modalDescription: {
        color: '#222',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: moderateScale(18),
        marginBottom: verticalScale(20),
        textAlign: 'center',
    },
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        textAlign: 'center',
        color:'#222'
    },
});

export default DashBoardCardsModal;
