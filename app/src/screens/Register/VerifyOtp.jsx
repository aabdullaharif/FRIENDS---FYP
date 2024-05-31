import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Image,
} from "react-native";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import React, { useState } from 'react'
import axios from "axios";
import Loader from "../../../components/Loader";
import AlertMessage from "../../../components/Alert";

const CELL_COUNT = 6;

const VerifyOtp = ({ navigation, route }) => {
    const { email, id } = route.params;
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const verifyCodeHandler = async () => {
        if (value.length !== 6) {
            setIsError(true);
            setErrorMessage('Please enter a valid code');
            return;
        } else {
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/verifyOtp`, { email: email, otp: value });
                navigation.navigate('user-info', { token: response.data.token })
            } catch (error) {
                setIsError(true);
                setErrorMessage(error.response.data.message || 'Please try again');
            } finally {
                setLoading(false);
            }
        }
    }

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    return (
        <View style={styles.container}>
            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

            <Text style={styles.headingText}>OTP Verification</Text>
            <Text style={styles.subHead}>
                Enter the code sent to your email address.
            </Text>

            <View style={styles.cellsContainerParent}>
                <View style={styles.cellsContainer}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.loginButton} onPress={verifyCodeHandler}>
                    <Text style={styles.loginText}>Verify Code</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default VerifyOtp;

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: '11.6%',
        height: 35,
        fontSize: 24,
        textAlignVertical: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#192126',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    focusCell: {
        borderColor: '#582C57',
    },
    cellsContainerParent: {
        width: "100%",
        alignItems: "center",
        marginTop: 20
    },
    cellsContainer: {
        width: "70%",
    },
    container: {
        width: "100%",
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: "100%",
        height: 100,
    },
    headingText: {
        fontSize: 28,
        fontWeight: "bold",
    },
    subHead: {
        fontSize: 14,
        textAlign: "center",
        margin: 10,
        color: "grey",
    },

    buttonContainer: {
        marginTop: 50,
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
    },
    emailInput: {
        width: "80%",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginBottom: 20,
    },
    loginButton: {
        width: "50%",
        backgroundColor: "#192126",
        padding: 10,
        borderRadius: 100,
        alignItems: "center",
        marginBottom: 20,
    },
    loginText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    inputTitle: {
        fontSize: 15,
        margin: 5,
    },
    input: {
        // height: 50,
        width: "80%",
        padding: 10,
    },
    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "gray",
    },
});
