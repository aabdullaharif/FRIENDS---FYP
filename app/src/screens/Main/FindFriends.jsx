import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Constants from "expo-constants";
import GoBackCom from '../../../components/GoBackCom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';

const FindFriends = ({ navigation }) => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem("token");
                const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/list`, {
                    headers: {
                        'Cookies': token
                    },
                });
                setUserData(response.data.users);
            } catch (error) {
                console.log(error);
                setIsError(true);
                setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                dispatch(setAuth(false));
                dispatch(setUser(null));
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <View style={styles.wrapper}>
            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

            <GoBackCom mBottom={15} navigation={navigation} />

            <FlatList
                data={userData}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Pressable onPress={()=>navigation.navigate("user-profile", { id: item._id } )} style={styles.listItem}>
                            <Image source={{ uri: item.profile_image_url }} style={styles.profileImg} />
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.username}>{item.username}</Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                style={{ height: '100%' }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default FindFriends

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
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
})