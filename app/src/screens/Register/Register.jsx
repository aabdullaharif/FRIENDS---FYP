import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import axios from 'axios';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';
import Input from '../../../components/Input';


const Register = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
    });

    const changeHandler = (name, value) => {
        setInputData({
            ...inputData,
            [name]: value
        })
    }

    const validateFields = () => {
        const newErrors = {
            email: inputData.email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputData.email),
            name: inputData.name === '',
            password: inputData.password === '',
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(error => error);
        return !hasError;
    };

    const signupHandler = async () => {
        if (inputData.password !== inputData.confirm_password) {
            Alert.alert('Password and Confirm Password must be same');
        } else {
            if (validateFields()) {
                setLoading(true);
                try {
                    const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/register`, inputData);
                    navigation.navigate('verify-otp', { email: inputData.email, id: response.data.user._id });
                } catch (error) {
                    setIsError(true);
                    setErrorMessage(error.response.data.message || 'An error occurred, please try again');
                } finally {
                    setLoading(false);
                }
            }
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
                    <Text style={styles.loginText}>Create an Account</Text>
                </View>
                <View style={styles.inputContainers}>
                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Name</Text>
                    <Input error={errors.name} placeholder="Enter your Name" keyboardType="default" name={'name'} onChangeText={changeHandler} />

                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Email</Text>
                    <Input error={errors.email} placeholder="Email@example.com" keyboardType="email-address" name={'email'} onChangeText={changeHandler} />

                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Username</Text>
                    <Input error={errors.email} placeholder="Enter your username" keyboardType="default" name={'username'} onChangeText={changeHandler} />

                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Password</Text>
                    <Input error={errors.password} placeholder="Enter your Password" keyboardType="default" eye={true} name={'password'} secureTextEntry onChangeText={changeHandler} />

                    <Text style={{ marginBottom: 10, marginTop: 10 }}>Confirm Password</Text>
                    <Input error={errors.password} placeholder="Enter your Confirm Password" keyboardType="default" eye={true} name={'confirm_password'} secureTextEntry onChangeText={changeHandler} />

                </View>

                <View style={styles.btnContainer}>
                    <Pressable style={styles.btn} onPress={signupHandler}>
                        <Text style={{ color: "#ffffff", fontSize: 15, fontFamily: "SFPro-700" }}>SignUp</Text>
                    </Pressable>
                </View>

                <View style={styles.signupContainer}>
                    <Text>Don't Have an account?</Text>
                    <Pressable onPress={() => navigation.navigate("login")}>
                        <Text style={{ color: "#006d95", fontSize: 13, fontFamily: "SFPro-600", marginLeft: 5 }}>Log In</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Register

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
        marginBottom: 0,
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