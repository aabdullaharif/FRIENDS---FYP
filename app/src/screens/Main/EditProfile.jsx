import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import Constants from "expo-constants";
import GoBackCom from '../../../components/GoBackCom';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';
import * as ImagePicker from 'expo-image-picker';
import Input from '../../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setAuth, setUser } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux/dist/react-redux';

const EditProfile = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [resultAssets, setResultAssets] = useState(null);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const currUser = useSelector((state) => state.auth.user);
    const [isFormEdited, setIsFormEdited] = useState(false);

    useEffect(() => {
        if (status !== 'granted') {
            requestPermission();
        }
    }, []);

    const [inputData, setInputData] = useState({
        name: '',
        bio: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        bio: false,
    });

    const changeHandler = (name, value) => {
        setInputData({
            ...inputData,
            [name]: value
        });

        if (!isFormEdited && value !== currUser[name]) {
            setIsFormEdited(true);
        }
    }

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setResultAssets(result.assets[0])
            setImage(result.assets[0].uri);
            setIsFormEdited(true);
        }
    };

    const updateHandler = async ()=>{
        console.log("update");
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/me`, { 
                name: inputData ? inputData.name : undefined,
                bio: inputData ? inputData.bio : undefined,
                base64String: resultAssets ? resultAssets.base64 : undefined,
                mType: resultAssets ? resultAssets.mimeType : undefined
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookies': `${token}`
                    },
                });

            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(setAuth(true));
            dispatch(setUser(response.data.user));
            navigation.goBack();
        } catch (error) {
            console.log(error)
            setIsError(true);
            setErrorMessage(error.response?.data?.message || "Network Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "null"}
            enabled
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
            >
                {loading && <Loader />}
                {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

                <View style={styles.wrapper}>
                    <GoBackCom navigation={navigation} mBottom={14} />

                    <View
                        style={{
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "SFPro-600",
                                fontSize: 18,
                                textAlign: "center",
                                marginBottom: 20
                            }}
                        >Update your Profile!</Text>

                        <View style={styles.inputContainers}>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: "SFPro-600", fontSize: 16 }}>Name</Text>
                            <Input error={errors.name} placeholder={currUser.name} keyboardType="default" name={'name'} onChangeText={changeHandler} />
                        </View>
                        <View style={styles.inputContainers}>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: "SFPro-600", fontSize: 16 }}>Bio</Text>
                            <Input error={errors.name} placeholder={currUser.bio} keyboardType="default" name={'bio'} onChangeText={changeHandler} />
                        </View>

                        <View style={styles.inputContainers}>
                            <Text style={{ marginBottom: 10, marginTop: 10, fontFamily: "SFPro-600", fontSize: 16 }}>Profile Image</Text>
                            <View style={styles.wrapUpload}>
                                <View style={styles.profileImgWrap}>
                                    {image ?
                                        <Image source={{ uri: image }} style={styles.profileImg} />
                                        :
                                        <Image source={{ uri: currUser.profile_image_url }} style={styles.profileImg} />
                                    }
                                </View>
                                <Pressable style={styles.signUpBtn} onPress={pickImage}>
                                    <Text style={styles.signUpText}>UPLOAD HERE</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.btnContainer}>
                            <Pressable  style={[styles.btn, !isFormEdited && styles.btnDisabled]} onPress={updateHandler}  disabled={!isFormEdited}>
                                <Text style={{ color: "#ffffff", fontSize: 15, fontFamily: "SFPro-400" }}>UPDATE</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 10,
        paddingRight: 10,
    },
    btnWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderBlockColor: '#000',
        borderWidth: 1,
        padding: 5,
        borderRadius: 10
    },
    inputContainers: {
        width: "90%"
    },
    wrapUpload: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    profileImgWrap: {
        marginBottom: 16
    },
    profileImg: {
        width: 80,
        height: 80,
        objectFit: 'contain',
        borderRadius: 9999
    },
    signUpBtn: {
        width: "50%",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#572C57",
    },
    signUpText: {
        fontSize: 16,
        fontFamily: "SFPro-600"
    },
    btnContainer: {
        width: "100%",
        marginTop: 30,
        alignItems: "center",
    },
    btn: {
        backgroundColor: "#192126",
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        width: "40%"
    },
    btnDisabled: {
        backgroundColor: "#cccccc",
    },
});