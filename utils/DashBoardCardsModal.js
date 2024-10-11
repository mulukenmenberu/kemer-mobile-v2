import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Device';
import { Modal } from 'react-native-paper';

const DashBoardCardsModal = ({ visible, hideModal, navigation, courses, setActive, showPackages }) => {
    const containerStyle = {
        backgroundColor: '#f5f5f5',
        padding: 20,
        marginTop: verticalScale(-70),
        width: '90%',
        height: '60%',
        alignSelf: 'center',
        borderRadius: moderateScale(15),
    };

    const setSelection = (course_id) => {
        hideModal();
        setActive(course_id);
    };

    const openQuizPage = (package_id, package_name, tags) => {
        navigation.navigate('QuizeDescription', {
            package_id: package_id,
            package_name: package_name,
            tags: tags,
        });
    };

    const extractedPackages = courses.reduce((acc, course) => {
        return acc.concat(course.packages); // Concatenate packages from each course
    }, []);

    return (
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            {!showPackages && (
                <Text style={styles.tag}>
                    {"Select Courses to get list of question packages"}
                </Text>
            )}
            {showPackages && (
                <Text style={styles.tag}>
                    {"Select a package to get list of questions"}
                </Text>
            )}

            <ScrollView>
                {showPackages && (
                    <View style={styles.cardContainer}>
                        {extractedPackages.map((course, index) => (
                            <TouchableOpacity
                                key={course.package_id}
                                onPress={() => openQuizPage(course.package_id, course.package_name, course.tags)}
                                style={[styles.card, index % 2 === 0 ? styles.evenCard : styles.oddCard]} // Striped effect
                            >
                                <Text style={styles.cardTitle}>{index + 1}. {course.package_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {!showPackages && (
                    <View style={styles.cardContainer}>
                        {courses.map((course, index) => (
                            <TouchableOpacity
                                key={course.course_id}
                                onPress={() => setSelection(course.course_id)}
                                style={[styles.card, index % 2 === 0 ? styles.evenCard : styles.oddCard]} // Striped effect
                            >
                                <Text style={styles.cardTitle}>{index + 1}. {course.course_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tag: {
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
    },
    evenCard: {
        backgroundColor: '#f0f0f0', // Light gray for even rows
    },
    oddCard: {
        backgroundColor: '#ffffff', // White for odd rows
    },
    cardTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#222',
    },
    closeButton: {
        backgroundColor: '#FF6347',
        paddingVertical: verticalScale(10),
        paddingHorizontal: horizontalScale(30),
        borderRadius: moderateScale(10),
        marginTop: verticalScale(10),
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        textAlign: 'center',
    },
});

export default DashBoardCardsModal;
