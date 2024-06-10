import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import axios from 'axios';
import AlertMessage from '../../../components/Alert';
import Header from '../../../components/Profile/Header';
import PostGrid from '../../../components/Profile/PostGrid';
import { useSelector } from 'react-redux';
import Constants from "expo-constants";

const Profile = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const currUser = useSelector((state) => state.auth.user);
    const [postData, setPostData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    const fetchUserPosts = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/posts`, {
                headers: {
                    'Cookies': token
                },
            });
            setPostData(response.data.posts);
        } catch (error) {
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchUserPosts();
        setIsRefreshing(false);
    };


    useEffect(() => {
        fetchUserPosts();
    }, [currUser]);

    const RenderItem = ({ item }) => <PostGrid postData={item} />;
    const numberOfCols = 3;

    return (
        <View
            style={styles.wrapper}
        >
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            {currUser &&
                <Header currUser={currUser} />
            }

            {postData.length > 0 ?
                <View style={styles.container}>
                    <FlatList
                        data={postData}
                        keyExtractor={(item, index) => index}
                        numColumns={numberOfCols}
                        renderItem={({ item, index }) => (
                            <View style={index === postData.length - 1 ? { paddingBottom: 220 } : {}}>
                                <RenderItem item={item} />
                            </View>
                        )}
                        style={{ height: '100%' }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                </View>
                :
                <View
                    style={{
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: "SFPro-600"
                        }}
                    >No posts</Text>
                </View>
            }
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 10,
        flex: 1,
    },
    container: {
    },
});
