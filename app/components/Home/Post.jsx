import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
import Loader from '../Loader';
import axios from 'axios';
import AlertMessage from '../Alert';
import FeedImage from '../FeedImage';

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            liked: false,
            likeCount: props.postData.likes.length,
            loading: false,
            isError: false,
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = async () => {
        console.log("post id", this.props.postData._id)
        console.log("user id", this.props.postData.user)

        this.setState({ loading: true, isError: false, errorMessage: '' });
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/${this.props.postData.user}`, {
                headers: {
                    'Cookies': token
                },
            });

            if (response?.status === 200 && response.data) {
                const parsedUser = response.data.user;
                console.log("PUser", parsedUser._id);
                console.log("PData", this.props.postData.likes);

                const hasLiked = this.props.postData.likes.some(like => like.user === parsedUser._id);

                console.log({ hasLiked })

                this.setState({
                    user: parsedUser,
                    liked: hasLiked
                });
            } else {
                this.setState({
                    isError: true,
                    errorMessage: 'Failed to get user data'
                });
            }
        } catch (error) {
            this.setState({
                isError: true,
                errorMessage: error?.response?.data?.message || 'An error occurred, please try again'
            });
        } finally {
            this.setState({ loading: false });
        }
    };


    // handleLike = async () => {
    //     this.setState(prevState => ({
    //         liked: !prevState.liked,
    //         likeCount: prevState.liked ? prevState.likeCount - 1 : prevState.likeCount + 1
    //     })); 

    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         await axios.put(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/posts/${this.props.postData._id}`, {
    //             headers: {
    //                 'Cookies': token
    //             },
    //         });
    //     } catch (error) {
    //         this.setState(prevState => ({
    //             liked: !prevState.liked,
    //             likeCount: prevState.liked ? prevState.likeCount - 1 : prevState.likeCount + 1
    //         }));

    //         this.setState({
    //             isError: true,
    //             errorMessage: error?.response?.data?.message || 'An error occurred, please try again'
    //         });
    //     } 
    // };

    errorOkHandler = () => {
        this.setState({ isError: false });
    };

    render() {
        const { user, liked, likeCount, loading, isError, errorMessage } = this.state;
        const { postData } = this.props;

        return (
            <View style={styles.postWrapper}>
                {loading && <Loader />}
                {isError && <AlertMessage message={errorMessage} onPressOk={this.errorOkHandler} />}
                <View style={styles.postHeader}>
                    <Image
                        source={{
                            uri: user?.profile_image_url ?? process.env.EXPO_PUBLIC_DEFAULT_PROFILE_URL
                        }}
                        style={styles.profileImg}
                    />
                    <Text style={styles.username}>{user?.username ?? 'Username'}</Text>
                </View>
                <View>
                    <FeedImage mediaUrl={postData.mediaUrl} isTrue={true} />
                    <View style={styles.postActions}>
                        {/* <Pressable onPress={this.handleLike} style={styles.likeButton}>
                            <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "black"} />
                            <Text style={styles.likeCount}>{likeCount}</Text>
                        </Pressable> */}

                        {/* Uncomment and update comment handling as needed */}
                        {/* <View style={styles.likeButton}>
                            <FontAwesome name="comment-o" size={24} color="black" />
                            <Text style={styles.likeCount}>{postData.comments.length > 0 ? postData.comments.length : 0}</Text>
                        </View> */}
                    </View>
                    <Text style={styles.caption}>{postData.caption}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    postWrapper: {
        marginBottom: 20
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    username: {
        fontFamily: 'SFPro-600',
        fontSize: 16,
        color: '#000'
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 999,
        objectFit: 'contain',
    },
    postImage: {
        width: '100%',
        height: 500
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 15,
        padding: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5
    },
    likeCount: {
        color: '#000',
        fontFamily: 'SFPro-600',
        fontSize: 14
    },
    caption: {
        color: '#000',
        fontFamily: 'SFPro-400',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    }
})