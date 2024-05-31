import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserSearch from '../../../components/Explore/Search';
import Constants from "expo-constants";

const Explore = () => {
  return (
    <View style={styles.wrapper}>
      <UserSearch />
    </View>
  )
}

export default Explore;

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 0,
        flex: 1,
    },
})