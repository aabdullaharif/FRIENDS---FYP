import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Constants from "expo-constants";
import GoBackCom from '../../../components/GoBackCom';
import { useDispatch } from 'react-redux';
import { setAuth, setUser } from '../../../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';
import AlertMessage from '../../../components/Alert';
import axios from 'axios';

const ProfileSettings = ({ navigation, route }) => {
    const { currUser } = route.params;
    const dispatch = useDispatch();
    const [visibility, setVisibility] = useState(currUser.visibility);
    const [isEnabled, setIsEnabled] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorOkHandler = () => setIsError(false);

    console.log({ visibility })
    useEffect(() => {
        setIsEnabled(visibility === "public" ? true : false);
    }, [visibility]);
    

    const toggleSwitch = async () => { 
        const newVisibility = visibility === "public" ? "private" : "public";
        setVisibility(newVisibility);

        try {
            const token = await AsyncStorage.getItem("token");
            await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/visibility`, {
                headers: {
                    'Cookies': token
                },
            });
            fetchUserDetails();
        } catch (error) {
            console.log(error);
            setIsError(true);
            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        } 
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            dispatch(setAuth(false));
            dispatch(setUser(null));
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleAccountDelete = async () => { 
        Alert.alert(
            "Confirm Account Deletion",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const token = await AsyncStorage.getItem("token");
                            await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${currUser._id}`, {
                                headers: {
                                    'Cookies': token
                                },
                            });
                            dispatch(setAuth(false));
                            dispatch(setUser(null));
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('user');
                        } catch (error) {
                            console.log(error);
                            setIsError(true);
                            setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
                        } finally {
                            setLoading(false); 
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const fetchUserDetails = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/me`, {
            headers: {
              'Cookies': token
            },
          });

          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          dispatch(setUser(response.data.user));
        } catch (error) {
          setIsError(true);
          setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
        }
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.wrapper}>

            {loading && <Loader />}
            {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

            <GoBackCom navigation={navigation} mBottom={14} />

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 15,
                borderBlockColor: "#000",
                borderWidth: 1,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 12
            }}>
                <Text
                    style={{
                        fontFamily: "SFPro-600",
                        color: "#000",
                    }}
                >Profile Visibility</Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#F48C44"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text
                        style={{
                            fontFamily: "SFPro-400",
                            color: "#000",
                            textTransform: "capitalize"
                        }}
                        >{visibility}</Text>
                </View>
            </View>

            <Pressable
                style={[styles.btnWrap, { backgroundColor: "red", borderBlockColor: "red", marginBottom: 15 }]}
                onPress={handleAccountDelete}
            >
                <Ionicons name="warning-outline" size={24} color="#fff" />
                <Text
                    style={{
                        fontFamily: "SFPro-600",
                        color: "#fff"
                    }}
                >Delete My Account</Text>
            </Pressable>

            <Pressable
                style={styles.btnWrap}
                onPress={handleLogout}
            >
                <Ionicons name="power-outline" size={24} color="#000" />
                <Text
                    style={{
                        fontFamily: "SFPro-600"
                    }}
                >Logout</Text>
            </Pressable>
        </ScrollView>
    )
}

export default ProfileSettings

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 10,
        paddingRight: 10
    },
    btnWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderBlockColor: '#000',
        borderWidth: 1,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 10,
        width: "100%",
        justifyContent: "center",
    }
})