import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoBackCom from '../GoBackCom';
import Loader from '../Loader';
import AlertMessage from '../Alert';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

export default function Header({ userDetails, navigation, onFollowRequest }) {
    const dispatch = useDispatch();
    const [checkRequest, setCheckRequest] = useState("follow");
    const [userDetailsFetched, setUserDetailsFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    useEffect(() => {
        const checkRequest = async () => {
            // setLoading(true);
            try {
                const id = userDetails._id;
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/request/${id}`, {
                    headers: {
                        'Cookies': token
                    },
                });


                if (response.data.success === true) {
                    setCheckRequest("sent");
                }
            } catch (error) {
                console.log(error)
                setIsError(true);
                setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
            }
            // finally {
            //     setLoading(false);
            // }
        }
        const checkFollowing = async () => {
            // setLoading(true);
            try {
                const id = userDetails._id;
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/following/${id}`, {
                    headers: {
                        'Cookies': token
                    },
                });

                if (response.data.isFollowing === true) {
                    setCheckRequest("following");
                }
            } catch (error) {
                console.log(error)
                setIsError(true);
                setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
            }
            // finally {
            //     setLoading(false);
            // }
        }
        checkRequest();
        checkFollowing();
    }, []);


    const handleFollowRequest = async (id, buttonText) => {
        if (buttonText === "Following") {
            setCheckRequest("follow");
        } else if (buttonText === "Follow") {
            if (userDetails.visibility === "public") {
                setCheckRequest("following");
            } else {
                setCheckRequest("sent");
            }
        } else if (buttonText === "Request Sent") {
            setCheckRequest("follow");
        }
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${id}/follow`, {
                headers: {
                    'Cookies': token
                },
            });

            setUserDetailsFetched(true);

            if (response.data.message === "Request Canceled") {
                setCheckRequest("follow");
            } else if (response.data.message === "Follow Request Sent") {
                setCheckRequest("sent");
            } else if (response.data.message === "Following User") {
                setCheckRequest("following");
                await fetchUserDetails();
                await onFollowRequest();
            } else if (response.data.message === "UnFollowing User") {
                setCheckRequest("follow");
                await fetchUserDetails();
                await onFollowRequest();
            }

        }
        catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        }
        finally{
            setUserDetailsFetched(false);
        } 
    }

    const fetchUserDetails = async () => {
        try { 
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/me`, {
                headers: {
                    'Cookies': token
                },
            });

            //   console.log(response.data.user);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            dispatch(setUser(response.data.user));
        } catch (error) {
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        }
    };

    const [userFollowers, setUserFollowers] = useState([]);
    const [userFollowings, setUserFollowings] = useState([]);

    const fetchUserFollowers = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${userDetails._id}/followers`, {
                headers: {
                    'Cookies': token
                },
            });
            setUserFollowers(response.data.followers);
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'Error Fetching User Followers');
        }
    };

    const fetchUserFollowings = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${userDetails._id}/followings`, {
                headers: {
                    'Cookies': token
                },
            });
            setUserFollowings(response.data.followings);
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'Error Fetching User Followings');
        }
    };

    useEffect(() => {
        fetchUserFollowers();
        fetchUserFollowings();
    }, [userDetailsFetched]);

    return (
        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
            {/* {loading && <Loader />} */}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
            <View style={styles.topBar}>
                <Text style={[styles.username]}>{userDetails.username}</Text>
                <GoBackCom navigation={navigation} mBottom={0} />
            </View>
            <View style={styles.headerWrapper}>
                <View>
                    <Image source={{ uri: userDetails.profile_image_url ? userDetails.profile_image_url : process.env.EXPO_PUBLIC_DEFAULT_PROFILE_URL }} style={styles.profileImg} />
                </View>
                <View style={styles.countWrapper}>
                    <View>
                        <Text style={styles.count}>{userDetails.post_count}</Text>
                        <Text style={styles.countText}>Posts</Text>
                    </View>
                    <Pressable onPress={() => navigation.navigate("socials", { socialsData: userFollowers, isFollowers: true })}>
                        <Text style={styles.count}>{userFollowers.length}</Text>
                        <Text style={styles.countText}>Followers</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("socials", { socialsData: userFollowings, isFollowers: false })}>
                        <Text style={styles.count}>{userFollowings.length}</Text>
                        <Text style={styles.countText}>Following</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.bioWrapper}>
                <View>
                    <Text style={styles.name}>{userDetails.name}</Text>
                    {userDetails?.bio && (
                        <Text style={styles.name}>{userDetails?.bio}</Text>
                    )}
                </View>
            </View>

            <View style={styles.ctaWrapper}>
                <Pressable
                    onPress={() => {
                        const buttonText = checkRequest === "follow"
                            ? "Follow"
                            : (checkRequest === "sent"
                                ? "Request Sent"
                                : (checkRequest === "following"
                                    ? "Following"
                                    : "Unknown Status"));

                        handleFollowRequest(userDetails._id, buttonText);
                    }}
                    style={[
                        styles.followBtn,
                        checkRequest !== "follow" ? styles.followactive : []
                    ]}
                >
                    <Text style={styles.followBtnText}>
                        {checkRequest === "follow"
                            ? "Follow"
                            : (checkRequest === "sent"
                                ? "Request Sent"
                                : (checkRequest === "following"
                                    ? "Following"
                                    : "Unknown Status"))
                        }
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profileImg: {
        width: 60,
        height: 60,
        borderRadius: 999,
        objectFit: "contain"
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "grey",
    },
    bioWrapper: {
        marginBottom: 20
    },
    count: {
        fontFamily: 'SFPro-600',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 2
    },
    username: {
        fontFamily: 'SFPro-600',
        fontSize: 20,
    },
    countText: {
        fontFamily: 'SFPro-400'
    },
    countWrapper: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerWrapper: {
        flexDirection: 'row',
        columnGap: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingTop: 10
    },
    name: {
        fontFamily: 'SFPro-400'
    },
    ctaWrapper: {
        flexDirection: 'row',
        columnGap: 5,
        justifyContent: 'space-between',
        borderWidth: 0
    },
    followBtn: {
        backgroundColor: '#ed6202',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 5
    },
    followBtnText: {
        fontFamily: 'SFPro-600',
        textTransform: "uppercase",
        fontSize: 14,
        color: "#fff",
        padding: 7,
        letterSpacing: 0.5
    },
    followactive: {
        backgroundColor: "#171361"
    }
})