import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const Input = ({ placeholder, keyboardType = 'default', secureTextEntry = false, eye, onChangeText, name, editable = true, error }) => {
    const [secureText, setSecureText] = useState(secureTextEntry);
    const [eyeIcon, setEyeIcon] = useState(eye ? 'eye-off' : '');
    const eyePressHandler = () => {
        setSecureText(!secureText);
        setEyeIcon(eyeIcon === 'eye' ? 'eye-off' : 'eye');
    }

    return (
        <View style={styles.parentContainer}>
            <TextInput style={error ? styles.errorContainer : styles.container} name={name} placeholder={placeholder} keyboardType={keyboardType} placeholderTextColor={error ? '#970000' : "#848484"} secureTextEntry={secureText} onChangeText={(e) => onChangeText(name, e)} editable={editable} />
            <Pressable style={styles.eye} onPress={eyePressHandler}>
                <Ionicons name={eyeIcon} size={25} color={'#888888'} />
            </Pressable>
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    parentContainer: {
        position: "relative",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 10,
        padding: 10
    },
    container: {
        minWidth: '100%',
        color: '#000',
        fontSize: 18,
        fontWeight: '400',
        // fontFamily: "SFPro-400",
        letterSpacing: -0.2,
    },
    errorContainer: {
        minWidth: '100%',
        color: '#000',
        fontSize: 18,
        fontWeight: '400',
        // fontFamily: "SFPro-400",
        // letterSpacing: -0.2,
        borderColor: "#ff0000",
    },
    eye: {
        position: 'absolute',
        right: 10,
        top: "40%"
    }
})