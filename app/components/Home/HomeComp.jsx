import { FlatList, Text, View, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import React from 'react'
import Feed from './Feed';

const HomeComp = ({ displayedPosts, user, onEndReached, handlePostLike, handlePostComment, isLoading, navigation }) => {
    const RenderItem = ({ item }) => <Feed item={item} onLike={() => handlePostLike(item._id)} onComment={() => handlePostComment(item._id)} likeCount={item.likes.length} commentCount={item.comments.length} />;

    if (displayedPosts.length > 0) {
        return (
            <FlatList
                data={displayedPosts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={RenderItem}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading && <ActivityIndicator size="large" color="#000" />
                }
            />
        );
    } else {
        return (
            <NoPostsScreen user={user} navigation={navigation} />
        );
    }
}

const NoPostsScreen = ({ user, navigation }) => (
    <View style={styles.nopost}>
        <Text
            style={{
                fontFamily: "SFPro-700",
                fontSize: 18,
                marginBottom: 16,
                textTransform: "uppercase",
                color: "#F48C44"
            }}
        >WELCOME {user.name}!</Text>
        <Text
            style={{
                fontFamily: "SFPro-600",
                fontSize: 16,
                marginBottom: 16
            }}
        >Follow Users to See Posts</Text>
        <Pressable
            onPress={() => navigation.navigate("find-friends")}
            style={{
                backgroundColor: "#F48C44",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 10,
                paddingBottom: 10,
                borderRadius: 10
            }}
        >
            <Text
                style={{
                    fontFamily: "SFPro-600",
                    color: "#fff",
                    fontSize: 14,
                    textTransform: "uppercase"
                }}
            >Find Friends</Text>
        </Pressable>
    </View>
);

export default HomeComp;

const styles = StyleSheet.create({})