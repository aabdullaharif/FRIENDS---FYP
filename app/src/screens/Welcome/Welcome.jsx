import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'

export default function Welcome({navigation}) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.headingWrapper}>
                    <Text style={styles.heading}>
                        Welcome to
                        <Text style={styles.subheading}> FRIENDS</Text>
                    </Text>
                </View>
                <View style={styles.btnWrapper}>
                    <Pressable style={styles.btn} onPress={() => navigation.navigate('login')}>
                        <Text style={styles.btnText}>Get Started</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 30,
        fontFamily: 'SFPro-700',
        textAlign: 'center',
        textTransform: 'capitalize',
        marginBottom: 16
    },
    subheading: {
        fontSize: 30,
        fontFamily: 'SFPro-700',
        textAlign: 'center',
        color: "orange"
    },
    btnWrapper: {
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30
    },
    btn: {
        width: '100%',
        backgroundColor: '#192126',
        borderRadius: 99
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 14,
        paddingBottom: 14,
        textTransform: 'uppercase',
        fontFamily: 'SFPro-700',
        paddingLeft: 30,
        paddingRight: 30
    }
})