import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ isHome }) => {
    const navigation = useNavigation();
  return (
    <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    }}>
        <View style={styles.wrapper}>
            <Image source={require('../assets/images/friends-logo.png')} style={styles.logo} />
            <Text style={styles.appname}>FRIENDS</Text>
        </View>
        {isHome ? (
            <Pressable onPress={() => {navigation.navigate("inbox")}}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
            </Pressable>
        ) : null}
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
    wrapper: {
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