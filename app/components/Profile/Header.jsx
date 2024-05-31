import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AlertMessage from '../Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Header({ currUser }) {
    const navigation = useNavigation();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    const [userFollowers, setUserFollowers] = useState([]);
    const [userFollowings, setUserFollowings] = useState([]);

    const fetchUserFollowers = async() =>{
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${currUser._id}/followers`, {
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

    const fetchUserFollowings = async() =>{
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${currUser._id}/followings`, {
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
    }, [currUser]);

    return (
        <View style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 20 }}>
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

            <View style={styles.topBar}>
                <Text style={styles.username}>{currUser.username}</Text>
                
                <Pressable onPress={()=>navigation.navigate("profile-settings", { currUser: currUser } )}>
                    <Ionicons name="settings-outline" size={20} color="black" />
                </Pressable>
            </View>
            <View style={styles.headerWrapper}>
                <View>
                    <Image source={{ uri: currUser.profile_image_url ? currUser.profile_image_url : process.env.EXPO_PUBLIC_DEFAULT_PROFILE_URL }} style={styles.profileImg} />
                </View>
                <View style={styles.countWrapper}>
                    <View>
                        <Text style={styles.count}>{currUser.post_count}</Text>
                        <Text style={styles.countText}>Posts</Text>
                    </View>
                    <Pressable onPress={()=>navigation.navigate("socials", { socialsData: userFollowers, isFollowers: true })}>
                        <Text style={styles.count}>{currUser.follower_count}</Text>
                        <Text style={styles.countText}>Followers</Text>
                    </Pressable>
                    <Pressable onPress={()=>navigation.navigate("socials", { socialsData: userFollowings, isFollowers: false })}>
                        <Text style={styles.count}>{currUser.following_count}</Text>
                        <Text style={styles.countText}>Following</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.bioWrapper}>
                <View>
                    <Text style={styles.name}>{currUser.name}</Text>
                    <Text style={styles.name}>{currUser?.bio}</Text>
                </View>
            </View>
            <View style={styles.ctaWrapper}>
                <Pressable style={styles.btn} onPress={()=>navigation.navigate("edit-profile")}>
                    <Text style={styles.btnText}>EDIT PROFILE</Text>
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
        borderBottomColor: "grey"
    },
    bioWrapper: {
        marginBottom: 10
    },
    usernameProfile: {
        flex: 1
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
    },
    btn: {
        backgroundColor: "#F48C44",
        borderRadius: 5
    },
    btnText: {
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        color: "#fff",
        fontFamily: "SFPro-700"
    }
})