import React, { useEffect, useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';
import Input from '../../../components/Input';
import profileImage from "../../../assets/images/default-profile.png";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth, setUser } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux/dist/react-redux';


const UserInfo = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { token } = route.params;
    const [image, setImage] = useState(null);
    const [resultAssets, setResultAssets] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect(() => {
        if (status !== 'granted') {
            requestPermission();
        }
    }, []);

    const [inputData, setInputData] = useState({
        bio: '',
    });

    const [errors, setErrors] = useState({
        bio: false,
    });

    const changeHandler = (name, value) => {
        setInputData({
            ...inputData,
            [name]: value
        })
    }

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
        }
    };

    const signupHandler = async () => {
        setLoading(true);
        try {


            const formData = {
                base64String: resultAssets ? resultAssets.base64 : null,
                mType: resultAssets ? resultAssets.mimeType : null,
                bio: inputData?.bio ? inputData.bio : null
            }

            const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/completeRegistration`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Cookies': `${token}`
                    },
                });


            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(setAuth(true));
            dispatch(setUser(response.data.user));
            navigation.navigate('home');
        } catch (error) {
            console.log(error)
            setIsError(true);
            setErrorMessage(error.response?.data?.message || "Network Error");
        } finally {
            setLoading(false);
        }
    }

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "null"}
            enabled
        >
            <ScrollView
                contentContainerStyle={styles.innerContainer}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
            >
                {loading && <Loader />}
                {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
                <View style={styles.header}>
                    <View style={styles.parentLogo}>
                        <Image source={require('../../../assets/images/friends-logo.png')} style={styles.logo} />
                    </View>
                    <Text style={styles.loginText}>Complete your Registration</Text>
                </View>
                <View style={styles.inputContainers}>
                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Bio</Text>
                    <Input error={errors.name} placeholder="Enter your Bio" keyboardType="default" name={'bio'} onChangeText={changeHandler} />
                </View>
                <View style={styles.inputContainers}>
                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Profile Image</Text>
                    <View style={styles.wrapUpload}>
                        <View style={styles.profileImgWrap}>
                            {image ?
                                <Image source={{ uri: image }} style={styles.profileImg} />
                                :
                                <Image source={profileImage} style={styles.profileImg} />
                            }
                        </View>
                        <Pressable style={styles.signUpBtn} onPress={pickImage}>
                            <Text style={styles.signUpText}>UPLOAD HERE</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.btnContainer}>
                    <Pressable style={styles.btn} onPress={signupHandler}>
                        <Text style={{ color: "#ffffff", fontSize: 15, fontFamily: "SFPro-700" }}>Complete</Text>
                    </Pressable>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default UserInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        // justifyContent: 'center',
        paddingTop: 34,
        width: '100%',
        alignItems: "center"
    },
    innerContainer: {
        minWidth: "80%",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        // height: height - 0.1 * height,
    },
    header: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    parentLogo: {
        width: "100%",
        alignItems: "center"
    },
    logo: {
        width: 80,
        height: 80,
        objectFit: "contain",
        marginBottom: 10,
    },
    wrapUpload: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 16,
        fontFamily: "SFPro-700"
    },
    signUpBtn: {
        width: "50%",
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#572C57",
    },
    loginText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center'
    },
    inputContainers: {
        width: "90%"
    },
    forgotPassword: {
        width: "100%",
        alignItems: "flex-end",
        paddingRight: 20,
        marginTop: 10,
    },
    forgotText: {
        color: "#ff0000"
    },
    btnContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    profileImgWrap: {
        marginRight: 10
    },
    profileImg: {
        width: 80,
        height: 80,
        objectFit: 'contain',
        borderRadius: 9999
    },
    btn: {
        backgroundColor: "#192126",
        padding: 15,
        borderRadius: 100,
        width: "50%",
        alignItems: "center",
    },
    orContainer: {

        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    line: {
        width: "20%",
        height: 1,
        backgroundColor: "grey",
        marginHorizontal: 10
    },
    signupContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    }
});