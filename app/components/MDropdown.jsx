import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';

const MDropdown = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleDelete = () => {
        // Call a method to delete the post
    };
    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dots}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)} // This will be triggered when the user taps outside the modalView
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {/* Option to Delete Post */}
                            <TouchableOpacity onPress={handleDelete} style={styles.button}>
                                <Text
                                    style={{
                                        fontFamily: "SFPro-600",
                                        textAlign: "center",
                                        color: "#fff"
                                    }}
                                >Delete My Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>

    )
}

export default MDropdown

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    dots: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 12,
        width: 200,
        elevation: 2,
        backgroundColor: "#F48C44", 
    },
});