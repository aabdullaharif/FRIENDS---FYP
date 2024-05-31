import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Constants from "expo-constants";
import Header from '../../../components/Header';

const Notifications = () => {
  return (
    <View style={styles.wrapper}>
      <Header />
      <Text>Notifications</Text>
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Constants.statusBarHeight,
  }
})