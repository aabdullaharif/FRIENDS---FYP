import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Constants from "expo-constants";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import AlertMessage from '../Alert';
import GoBackCom from '../GoBackCom';
import Post from '../Home/Post';

const PostDetail = ({ navigation, route }) => {
  const { postId } = route.params;
  const [postDetails, setPostDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorOkHandler = () => setIsError(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/posts/${postId}`, {
          headers: {
            'Cookies': token
          },
        });

        setPostDetails(response.data.post);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setErrorMessage(error?.response?.data?.message || 'An error occurred, please try again');
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, []);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={styles.wrapper}>
      {loading && <Loader />}
      {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

      <GoBackCom navigation={navigation} mBottom={10}/>
      
      {postDetails ? (
        <Post postData={postDetails}/>
      ) : 
        <Loader />
      }
    </ScrollView>
  )
}

export default PostDetail

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Constants.statusBarHeight,
  }
})