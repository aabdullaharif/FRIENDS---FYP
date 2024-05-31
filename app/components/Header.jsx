import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.wrapper}>
        <Image source={require('../assets/images/friends-logo.png')} style={styles.logo} />
        <Text style={styles.appname}>FRIENDS</Text>
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10
    },
    appname: {
        fontFamily: 'SFPro-400',
        fontSize: 20
    },
    logo: {
        width: 50,
        height: 50,
        objectFit: 'contain'
    }
})