import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const SearchResults = ({ user, setUsers, setSearchTerm }) => {
    const navigation = useNavigation();

    const handlePress = (id) =>{
        navigation.navigate('user-profile', { id });
        setUsers("");
        setSearchTerm("");
    }

  return (
    <Pressable onPress={() => handlePress(user._id) } style={styles.wrapper}>
        <Image source={{ uri: user.profile_image_url ? user.profile_image_url : process.env.EXPO_PUBLIC_DEFAULT_PROFILE_URL }} style={styles.image} />
        <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
        </View>
    </Pressable>
  )
}

export default SearchResults

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
        marginBottom: 20
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 999,
        objectFit: 'contain'
    },
    name: {
        fontFamily: "SFPro-600",
        fontSize: 16
    },
    username: {
        fontFamily: "SFPro-400",
    }
})