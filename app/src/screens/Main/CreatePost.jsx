import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Constants from "expo-constants";
import Header from '../../../components/Header';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AlertMessage from '../../../components/Alert';
import Loader from '../../../components/Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux/dist/react-redux';
import { setAuth, setUser } from '../../../redux/slices/authSlice';


const CreatePost = ({ navigation }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [caption, setCaption] = useState();
  const [resultAssets, setResultAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    if (status !== 'granted') {
      requestPermission();
    }
  }, []);

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setResultAssets(result.assets[0])
      setImage(result.assets[0].uri);
      setImageShow(true);
    }
  }

  const handleUploading = async () => {
    if(!resultAssets || !caption){
      setIsError(true);
      setErrorMessage("Add all fields");
      return
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = {
        base64String: resultAssets.base64,
        mType: resultAssets.mimeType,
        caption
      }

      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/posts`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Cookies': `${token}`
          },
        });

      await fetchUserDetails();
      
      setCaption("");
      setResultAssets(null);
      setImageShow(false);
      navigation.navigate('home');
    } catch (error) {
      console.log(error)
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  }

  const fetchUserDetails = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorOkHandler = () => setIsError(false);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "null"}
      enabled
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >

        {loading && <Loader />}
        {isError && <AlertMessage message={errorMessage} onPressOk={errorOkHandler} />}

        <Header />

        <View style={styles.subwrapper}>
          <Text style={{
            fontFamily: "SFPro-600", fontSize: 20, marginBottom: 20, textAlign: "center"
          }}>ADD A POST</Text>

          <View style={styles.captionWrap}>
            <Text style={{
              fontFamily: "SFPro-600", fontSize: 18, marginBottom: 15
            }}>Caption</Text>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Caption..."
              placeholderTextColor="black"
              numberOfLines={2}
              multiline={true}
              value={caption}
              onChangeText={setCaption}
              style={{ borderRadius: 5, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, backgroundColor: "#e6edf7", fontFamily: "SFPro-600", fontSize: 14 }}
            />
          </View>


          <View style={{ marginBottom: 25 }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text style={{
                fontFamily: "SFPro-600", fontSize: 18
              }}>Choose Media</Text>
              <Pressable
                  onPress={() => imagePicker()}
                  style={[
                    { display: imageShow ? 'flex' : 'none' },
                    {alignItems: "center"}
                  ]}
                >
                    <FontAwesome6 name="add" size={18} color="#F48C44" />
                    <Text style={{
                      fontFamily: "SFPro-600", fontSize: 12
                    }}>Change Media</Text>
              </Pressable>
            </View>

            <Image
              style={{
                display: imageShow ? 'flex' : 'none',
                width: "100%",
                height: 300,
                resizeMode: "cover"
              }}
              source={{ uri: image ? image : process.env.EXPO_PUBLIC_DEFAULT_PROFILE_URL }}
            />

            <Pressable
              onPress={() => imagePicker()}
              style={[
                styles.imageBox,
                { display: imageShow ? 'none' : 'flex' }
              ]}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                <FontAwesome6 name="add" size={24} color="#F48C44" />
                <Text style={styles.fontFam}>Upload Media</Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={() => handleUploading()}
            style={{
              backgroundColor: "#F48C44",
              maxWidth: "40%",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              padding: 8,
              minWidth: "40%",
              borderRadius: 99
            }}>
            <Text style={{
              fontFamily: "SFPro-600", fontSize: 16, color: "#fff", textAlign: "center"
            }}>UPLOAD</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CreatePost

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  fontFam: {
    fontFamily: "SFPro-600"
  },
  subwrapper: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    height: "100%"
  },
  captionWrap: {
    marginBottom: 20,
  },
  imageBox: {
    width: "100%",
    height: 300,
    backgroundColor: "#e6edf7",
    justifyContent: "center",
    alignItems: "center"
  }
})