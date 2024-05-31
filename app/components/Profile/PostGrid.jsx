import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import FeedImage from '../FeedImage';

const PostGrid = ({ postData }) => {
    const navigation = useNavigation();
    const WIDTH = Dimensions.get('window').width/3;

    return (
        <View style={styles.containerItem}>
            <Pressable onPress={() => navigation.navigate('post-detail', { postId: postData._id })}>
                <FeedImage mediaUrl={postData.mediaUrl} wWidth={WIDTH} hHeight={WIDTH} />
            </Pressable>
        </View>
    )
}

export default PostGrid

const styles = StyleSheet.create({
    containerItem: {
        margin: 0.5
    } 
})