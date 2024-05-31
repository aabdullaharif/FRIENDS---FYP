import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import FeedImage from '../FeedImage';
import FastImage from 'react-native-fast-image';

const Feed = ({ item, onLike, onComment, likeCount, commentCount, liked }) => {

    return (
        <View style={styles.postWrapper}> 
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10
            }}>
                <View style={styles.postHeader}> 
                    <Image
                        source={{
                            uri: item.user?.profile_image_url
                        }}
                        style={styles.profileImg}
                    />
                    <Text style={styles.username}>{item.user.username ?? 'Username'}</Text>
                </View>
            </View>
            <View>
                <FeedImage mediaUrl={item.mediaUrl} isTrue={true} />
                
                <View style={styles.postActions}>
                    <TouchableOpacity onPress={onLike} style={styles.likeButton}>
                        <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
                        <Text style={styles.likeCount}>{likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onComment} style={styles.likeButton}>
                        <FontAwesome name="comment-o" size={24} color="black" />
                        <Text style={styles.likeCount}>{commentCount}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.caption}>{item.caption}</Text>
            </View>
        </View>
    )
}

export default Feed;

const styles = StyleSheet.create({
    postWrapper: {
        marginBottom: 20
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    username: {
        fontFamily: 'SFPro-600',
        fontSize: 16,
        color: '#000'
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 999,
        objectFit: 'contain',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
        padding: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5
    },
    likeCount: {
        color: '#000',
        fontFamily: 'SFPro-600',
        fontSize: 14
    },
    caption: {
        color: '#000',
        fontFamily: 'SFPro-400',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    }
});