import { StyleSheet } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Fontisto } from '@expo/vector-icons';
import { setAuth, setUser } from '../redux/slices/authSlice';
import { AntDesign } from '@expo/vector-icons';

import Register from '../src/screens/Register/Register';
import Welcome from '../src/screens/Welcome/Welcome';
import Login from '../src/screens/Login/Login';
import Home from '../src/screens/Main/Home';
import VerifyOtp from '../src/screens/Register/VerifyOtp';
import UserInfo from '../src/screens/Register/UserInfo';
import Profile from '../src/screens/Main/Profile';
import Chats from '../src/screens/Main/Chats';
import Explore from '../src/screens/Main/Explore';
import PostDetail from '../components/Profile/PostDetail';
import UserProfile from '../src/screens/Main/UserProfile';
import Notifications from '../src/screens/Main/Notifications';
import CreatePost from '../src/screens/Main/CreatePost';
import ProfileSettings from '../src/screens/Main/ProfileSettings';
import Socials from '../src/screens/Main/Socials';
import FindFriends from '../src/screens/Main/FindFriends';
import EditProfile from '../src/screens/Main/EditProfile';

const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

const BottomNavigation = () => {
    return (
        <BottomTabs.Navigator
            initialRouteName='home'
            sceneContainerStyle={{ backgroundColor: '#f5f5f5' }}
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                headerShown: false
            }}
        >
            <BottomTabs.Screen
                name="home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name="home"
                            color={focused ? '#F48C44' : "#fff"}
                            size={30}
                        />
                    )
                }}
            />
            <BottomTabs.Screen
                name="explore"
                component={Explore}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name="search"
                            color={focused ? '#F48C44' : "#fff"}
                            size={30}
                        />
                    ),
                }}
            />
            <BottomTabs.Screen
                name="upload-image"
                component={CreatePost}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <AntDesign name="pluscircleo" size={28} color={focused ? '#F48C44' : "#fff"} />
                    )
                }}
            />
            {/* <BottomTabs.Screen
                name="notifications"
                component={Notifications}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Fontisto name="heart" size={24}color={focused ? '#F48C44' : "#fff"} />
                    ),
                }}
            /> */}
            <BottomTabs.Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name="people"
                            color={focused ? '#F48C44' : "#fff"}
                            size={30}
                        />
                    ),
                }}
            />
        </BottomTabs.Navigator>
    );
};

const RegisterStack = () => {
    return (
        <Stack.Navigator initialRouteName='register' screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} >
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="verify-otp" component={VerifyOtp} />
            <Stack.Screen name="user-info" component={UserInfo} />
        </Stack.Navigator>
    );
};

const Navigation = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => state.auth.isAuth);
    useLayoutEffect(() => {
        const checkAuth = async () => {
            // await AsyncStorage.clear()
            const token = await AsyncStorage.getItem('token');
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);

            if (token && user) {
                dispatch(setAuth(true));
                dispatch(setUser(user));
            }
        };
        checkAuth();
    }, []);

    return isAuth ? (
        <Stack.Navigator initialRouteName='main' screenOptions={{ animation: 'default', headerShown: false }}>
            <Stack.Screen name="main" component={BottomNavigation} />
            {/* Other screens */}
            <Stack.Screen name="post-detail" component={PostDetail} /> 
            <Stack.Screen name="user-profile" component={UserProfile} /> 
            <Stack.Screen name="profile-settings" component={ProfileSettings} /> 
            <Stack.Screen name="edit-profile" component={EditProfile} /> 
            <Stack.Screen name="socials" component={Socials} /> 
            <Stack.Screen name="find-friends" component={FindFriends} /> 
        </Stack.Navigator>
    ) : (
        <Stack.Navigator initialRouteName='welcome' screenOptions={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
            <Stack.Screen name="welcome" component={Welcome} />
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register-stack" component={RegisterStack} />
        </Stack.Navigator>
    );
};

export default Navigation;

const styles = StyleSheet.create({
    tabBar: {
        borderRadius: 99,
        backgroundColor: "#192126",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
        paddingBottom: 5,
        paddingTop: 5,
        maxHeight: 60,
        borderWidth: 1,
        borderColor: '#192126',
    },
});