import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InboxCard = ({onPress}) => {
  return (
    <Pressable onPress={onPress} style={{
        width:"100%", 
        borderWidth: 1, 
        flexDirection:"row", 
        justifyContent: "flex-start", 
        alignItems: "center", 
        borderRadius:20, 
        backgroundColor: "#192126", 
        padding: 10,
        marginBottom: 15
    }}>
      <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'}} style={{height:50,width:50}} />
      <View>
        <Text style={{fontSize: 18, fontWeight: "600", marginLeft: 10, color:"#fff", fontFamily: "SFPro-600"}}>Inbox</Text>
        <Text style={{fontSize: 16, marginLeft: 10, color: "#BBF246", fontFamily: "SFPro-400"}}>You have 3 unread messages</Text>
      </View>
    </Pressable>
  )
}

export default InboxCard

const styles = StyleSheet.create({})