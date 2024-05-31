import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import SearchBar from './SearchBar';
import AlertMessage from '../Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import SearchResults from './SearchResults';
import Constants from 'expo-constants';
import PostGrid from '../Profile/PostGrid';

const INITIAL_POST_COUNT = 15;
const CHUNK_SIZE = 10;
const DEBOUNCE_INTERVAL = 1000;

class UserSearch extends React.Component {
  state = {
    users: [],
    postsData: [],
    displayedPosts: [],
    searchTerm: '',
    loading: false,
    isError: false,
    errorMessage: '',
    endReached: false,
    isRefreshing: false
  };

  constructor(props) {
    super(props);
    this.onRefresh = this.onRefresh.bind(this); 
  }

  componentDidMount() {
    this.fetchPublicPosts();
  }

  fetchPublicPosts = async () => {
    this.setState({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/public/posts`, {
        headers: {
          'Cookies': token
        },
      });
      const initialPosts = response.data.posts.slice(0, INITIAL_POST_COUNT);
      this.setState({
        postsData: response.data.posts,
        displayedPosts: initialPosts
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isError: true,
        errorMessage: error?.response?.data?.message || 'An error occurred, please try again'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearch = async (query) => {
    if (query.trim() === '') {
      this.setState({ users: [], loading: false });
      return;
    }
    this.setState({ loading: true });
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/search?query=${query}`, {
        headers: {
          'Cookies': token
        },
      });
      this.setState({ users: response.data.users });
    } catch (error) {
      this.setState({
        isError: true,
        errorMessage: error?.response?.data?.message || 'An error occurred, please try again'
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  errorOkHandler = () => {
    this.setState({ isError: false });
  };

  setSearchTerm = (term) => {
    this.setState({ searchTerm: term });
  };

  setUsers = (usersArray) => {
    this.setState({ users: usersArray });
  };

  handleEndReached = () => {
    if (this.state.endReached || this.state.displayedPosts.length >= this.state.postsData.length) return;

    this.setState({ endReached: true });
    setTimeout(() => {
      const nextChunk = this.state.postsData.slice(
        this.state.displayedPosts.length,
        Math.min(this.state.displayedPosts.length + CHUNK_SIZE, this.state.postsData.length)
      );

      this.setState(prevState => ({
        displayedPosts: [...prevState.displayedPosts, ...nextChunk],
        endReached: false
      }));
    }, DEBOUNCE_INTERVAL);
  };

  onRefresh = async () => {
    this.setState({ isRefreshing: true });
    await this.fetchPublicPosts();
    this.setState({ isRefreshing: false });
  };

  render() {
    const { users, postsData, searchTerm, loading, isError, errorMessage, displayedPosts, endReached, isRefreshing } = this.state;

    const RenderItem = ({ item }) => (
      <SearchResults user={item} setUsers={this.setUsers} setSearchTerm={this.setSearchTerm} />
    );
    const PostRenderItem = ({ item }) => <PostGrid postData={item} />;
    const numberOfCols = 3;

    return (
      <View style={{ paddingTop: 20 }}>
        {loading && <Loader />}
        {isError && (
          <AlertMessage message={errorMessage} onPressOk={this.errorOkHandler} searchTerm={searchTerm} setSearchTerm={this.setSearchTerm} />
        )}

        <SearchBar
          onSearch={this.handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={this.setSearchTerm}
          setUsers={this.setUsers}
        />

        <View style={users.length === 0 ? { height: 10 } : styles.searchResults}>
          <FlatList
            data={users}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <RenderItem item={item} />}
          />
        </View>

        {users.length === 0 && (
          <FlatList
            data={displayedPosts}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numberOfCols}
            renderItem={({ item, index }) => (
              <View style={index === displayedPosts.length - 1 ? { paddingBottom: 60 } : {}}>
                <PostRenderItem item={item} />
              </View>
            )}
            style={{ height: '100%' }}
            showsVerticalScrollIndicator={false}
            onEndReached={this.handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              endReached &&
              <ActivityIndicator size="large" color="#000" />
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        )}
      </View>
    );
  }
}

export default UserSearch;

const styles = StyleSheet.create({
  searchResults: {
    paddingTop: Constants.statusBarHeight,
    paddingLeft: 10,
    paddingRight: 10,
  }
});
