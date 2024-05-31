import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Constants from "expo-constants";
import GoBackCom from '../../../components/GoBackCom';

const Socials = ({ navigation, route }) => {
    const { socialsData, isFollowers } = route.params;

    const RenderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Image source={{ uri: item.profile_image_url }} style={styles.profileImg} />
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.wrapper}>
            <GoBackCom navigation={navigation} mBottom={10} />

            {socialsData.length > 0 ? 
                <FlatList
                    data={socialsData}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item}) => (
                        <View style={{ marginTop: 10 }}>
                            <RenderItem item={item} />
                        </View>
                    )}
                    style={{ height: '100%' }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
                :
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                }}>
                    <Text style={styles.nomessage}>No {isFollowers === true ? "Followers" : "Followings"}</Text>
                </View>
            }
        </View>
    )
}

export default Socials

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 10,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    profileImg: {
        width: 50,
        height: 50,
        objectFit: "contain",
        borderRadius: 999,
        backgroundColor: "gray"
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginBottom: 10
    },
    username: {
        fontFamily: "SFPro-400"
    },
    name: {
        fontFamily: "SFPro-600",
        fontSize: 16
    },
    nomessage: {
        fontFamily: "SFPro-600",
        fontSize: 18
    }
})