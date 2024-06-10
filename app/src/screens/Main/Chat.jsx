import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Input from '../../../components/Input';
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";

const Chat = ({navigation}) => {
    const [inputData, setInputData] = useState({
        message: '',
    });

    const changeHandler = (name, value) => {
        setInputData({
            ...inputData,
            [name]: value
        })
    }

    return (
        <View style={styles.container}>
            {/* Chat Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" style={{marginRight:20}} onPress={()=> navigation.goBack()} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.userName}>Qaiser Abbas</Text>
                    <Text style={styles.userStatus}>Online</Text>
                </View>
            </View>

            {/* Chat Messages */}
            <ScrollView contentContainerStyle={[styles.messagesContainer, { flex: 1, justifyContent:"space-between" }]}>
                <View>

                    <View style={styles.messageRow}>
                        <View style={styles.messageSent}>
                            <Text style={styles.messageText}>Hello! How are you?</Text>
                        </View>
                        <Text style={styles.messageTime}>14:03pm</Text>
                    </View>
                    <View style={[styles.messageRow,{ justifyContent:"flex-end" }]}>
                        <View style={styles.messageReceived}>
                            <Text style={styles.messageText}>Hey, I'm fine.</Text>
                        </View>
                        <Text style={[styles.messageTime, { order: -1 }]}>14:36</Text>
                    </View>
                    <View style={[styles.messageRow,{ justifyContent:"flex-end" }]}>
                        <View style={styles.messageReceived}>
                            <Text style={styles.messageText}>What about you?</Text>
                        </View>
                        <Text style={[styles.messageTime, { order: -1 }]}>14:36</Text>
                    </View>
                    <View style={styles.messageRow}>
                        <View style={styles.messageSent}>
                            <Text style={styles.messageText}>I'm fine too.</Text>
                        </View>
                        <Text style={styles.messageTime}>14:50pm</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Input name='message' placeholder="Type a message here" />
                    <TouchableOpacity>
                        <Ionicons style={{ position: "relative", right: "100%" }} name="send" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
        paddingTop: Constants.statusBarHeight,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        elevation: 4, // for Android
        shadowOpacity: 0.1, // for iOS
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
    },
    arrowLeft: {
        width: 10,
        marginRight: 14,
    },
    userAvatar: {
        width: 44,
        height: 44,
        marginRight: 4,
    },
    userName: {
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 18,
        color: '#000000',
    },
    userStatus: {
        fontWeight: '400',
        fontSize: 10,
        lineHeight: 15,
        color: '#3c3c3c',
    },
    phoneIcon: {
        width: 44,
        marginLeft: 'auto',
    },
    messagesContainer: {
        flex: 1,
    },
    messageRow: {
        flexDirection: 'row',
        marginHorizontal: 24,
        marginVertical: 15,
        columnGap: 10,
    },
    messageSent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 10,
        maxWidth: '70%',
    },
    messageReceived: {
        backgroundColor: '#F3714E',
        borderRadius: 16,
        padding: 16,
        maxWidth: '70%',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#000',
        fontFamily: "SFPro-600"
    },
    messageTime: {
        fontSize: 12,
        color: 'rgba(2, 2, 2, 0.6)',
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    tickIcon: {
        width: 18,
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        paddingHorizontal: 17,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 12,
        lineHeight: 14,
        color: 'rgba(9, 9, 9, 0.6)',
    },
    sendIcon: {
        width: 34,
    },
});

export default Chat;
