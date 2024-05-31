import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const GoBackCom = ({ navigation, mBottom }) => {
  return (
    <View style={{ marginBottom: mBottom, marginTop: mBottom }}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.ctawrapper}>
            <Feather name="chevron-left" size={20} color="#F48C44" />
            <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
    </View>
  )
}

export default GoBackCom;

const styles = StyleSheet.create({
    ctawrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontFamily: "SFPro-600",
        fontSize: 14,
        color: "#F48C44"
    }
})