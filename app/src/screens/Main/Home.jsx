import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';
import axios from 'axios';
import Header from '../../../components/Header';
import Constants from "expo-constants";
import Feed from '../../../components/Home/Feed';

const CHUNK_SIZE = 6;
const DEBOUNCE_INTERVAL = 1000;

const Home = ({ navigation }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [postData, setPostData] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [endReached, setEndReached] = useState(false);

    const errorOkHandler = () => setIsError(false);

    const fetchUserPosts = async () => {
        setUser(JSON.parse(await AsyncStorage.getItem("user")));
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/recommended/posts`, {
                headers: {
                    'Cookies': token
                },
            });
            const initialPosts = response.data.posts.slice(0, CHUNK_SIZE);
            setPostData(response.data.posts);
            setDisplayedPosts(initialPosts);
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchUserPosts();
        setIsRefreshing(false);
    };


    useEffect(() => {
        fetchUserPosts();
    }, []);

    const handleEndReached = () => {
        if (endReached || displayedPosts.length >= postData.length) return;

        setEndReached(true);
        setTimeout(() => {
            const nextChunk = postData.slice(
                displayedPosts.length,
                Math.min(displayedPosts.length + CHUNK_SIZE, postData.length)
            );

            setDisplayedPosts((prevDisplayedPosts) => [...prevDisplayedPosts, ...nextChunk]);
            setEndReached(false);
        }, DEBOUNCE_INTERVAL);
    };

    const handlePostLike = async (id) => {
        console.log("like", id);
        // const postIndex = displayedPosts.findIndex(post => post._id === id);
        // if (postIndex === -1) return; 

        // setDisplayedPosts(prevDisplayedPosts =>
        //     prevDisplayedPosts.map((post, index) =>
        //         index === postIndex ? { ...post, likes: [...post.likes, 'new_like'] } : post
        //     )
        // );

        // try {
        //     const token = await AsyncStorage.getItem("token");
        //     await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/posts/${id}`, {
        //         headers: {
        //             'Cookies': token
        //         },
        //     });
        // } catch (error) {
        //     console.log(error)
        //     setIsError(true);
        //     setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        //     setDisplayedPosts(prevDisplayedPosts =>
        //         prevDisplayedPosts.map((post, index) =>
        //             index === postIndex ? { ...post, likes: post.likes.filter(like => like !== 'new_like') } : post
        //         )
        //     );
        // }
    }

    const handlePostComment = async (id) => {
        console.log("comment", id);
    }

    const RenderItem = ({ item }) => <Feed item={item} onLike={() => handlePostLike(item._id)} onComment={() => handlePostComment(item._id)} likeCount={item.likes.length} commentCount={item.comments.length} />;

    return (
        <View style={styles.wrapper}>
            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            <Header isHome={true} />

            {displayedPosts.length > 0 ?
                <>
                    <FlatList
                        data={displayedPosts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <RenderItem item={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            endReached &&
                            <ActivityIndicator size="large" color="#000" />
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                </>
                :
                <NoPostsScreen user={user} navigation={navigation} refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        </View>
    );
};

const NoPostsScreen = ({ user, navigation, refreshing, onRefresh }) => (
    <ScrollView
        contentContainerStyle={styles.nopost}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }
    >
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
    </ScrollView>
);

export default Home;

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 10,
        paddingLeft: 0,
        paddingRight: 0,
        flex: 1,
    },
    nopost: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }
});
