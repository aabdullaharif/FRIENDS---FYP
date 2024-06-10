import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Input from '../../../components/Input';
import InboxCard from '../../../components/InboxCard';
import Constants from "expo-constants";

const Inbox = ({ navigation }) => {
    const RenderItem = ({ item }) => <InboxCard info={item} onPress={()=> navigation.navigate("chat")}/>;
    return (
        <View style={{ flex: 1, 
            paddingLeft: 20,
            paddingRight: 20,
        }}>
            <View>

                <View style={styles.topBar}>
                    <Ionicons name="chevron-back-outline" size={25} color="#000" onPress={() => navigation.goBack()} />
                    <Text style={{ color: "#000", fontSize: 20, fontWeight: 600, fontFamily: "SFPro-600" }}>Inbox</Text>
                </View>

                {/* <View style={{alignItems:"center"}}>
                    <Input placeholder="Search anyone..." />
                    <Pressable style={{backgroundColor:"#000", padding: 10,borderRadius: 20,marginTop:10,marginBottom:30, width:"40%"}}>
                        <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>Search</Text>
                    </Pressable>
                </View> */}

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[1, 2, 3, 4, 5, 6]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={(item) => <RenderItem item={item} />}
                />
            </View>
        </View>
    )
}

export default Inbox

const styles = StyleSheet.create({
    topBar: {
        paddingTop: Constants.statusBarHeight,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 20
    }
})