import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import Loader from '../../../components/Loader';
import axios from 'axios';
import AlertMessage from '../../../components/Alert';
import Header from '../../../components/UserProfile/Header';
import PostGrid from '../../../components/Profile/PostGrid';
import Constants from "expo-constants";


const UserProfile = ({ route, navigation }) => {
  const { id } = route.params;
  const [postData, setPostData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorOkHandler = () => setIsError(false);

  const fetchUserDetails = async () => {
    // setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${id}`, {
        headers: {
          'Cookies': token
        },
      });

      setUserDetails(response.data.user);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
    } 
    // finally {
    //   setLoading(false);
    // }
  };
  const fetchUserPosts = async () => {
    // setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${id}/posts`, {
        headers: {
          'Cookies': token
        },
      });
      setPostData(response.data.posts);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
    }
    //  finally {
    //   setLoading(false);
    // }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserDetails(); 
    await fetchUserPosts(); 
    setIsRefreshing(false);
  };

  useEffect(() => { 
    fetchUserDetails();
    fetchUserPosts();
  }, []);

  const RenderItem = ({ item }) => <PostGrid postData={item} />;
  const numberOfCols = 3

  return (
    userDetails ? (
      <View style={styles.wrapper}>
        {/* {loading && <Loader />} */}
        {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}
  
        <Header userDetails={userDetails} navigation={navigation} onFollowRequest={fetchUserDetails} />
  
        <View style={styles.container}>
          {userDetails.visibility === "private" ? (
            <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontFamily: "SFPro-600" }}>This Account is Private</Text>
            </View>
          ) : postData.length > 0 ? (
            <FlatList
              data={postData}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numberOfCols}
              renderItem={({ item }) => <RenderItem item={item} />}
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
          ) : (
            <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontFamily: "SFPro-600" }}>No Posts</Text>
            </View>
          )}
        </View>
      </View>
    ) : null
  );
}

export default UserProfile;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
})