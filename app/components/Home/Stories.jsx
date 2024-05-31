import { StyleSheet, SafeAreaView, View, Button, Image, Text } from 'react-native';
// import ExpoInstaStory from 'expo-insta-story';
import React, { useCallback, useEffect, useState } from 'react';

const data = [
    {
      id: 1,
      profile_image_url:
        'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: 'Muhammad Bilal',
      stories: [
        {
          story_id: 1,
          story:
            'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
          duration: 10,
        },
        {
          story_id: 2,
          story:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
          duration: 10,
        },
      ],
    },
    {
      id: 2,
      profile_image_url:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Test User',
      stories: [
        {
          story_id: 1,
          story:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
          duration: 10,
        },
        {
          story_id: 2,
          story:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
          duration: 10,
          isVideo: true,
        },
      ],
    },
    {
      id: 3,
      profile_image_url:
        'https://randomuser.me/api/portraits/women/68.jpg',
      user_name: 'Jane Doe',
      stories: [
        {
          story_id: 1,
          story:
            'https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg',
          duration: 5,
        },
      ],
    },
    {
      id: 4,
      profile_image_url:
        'https://randomuser.me/api/portraits/men/32.jpg',
      user_name: 'John Smith',
      stories: [
        {
          story_id: 1,
          story:
            'https://images.pexels.com/photos/218983/pexels-photo-218983.jpeg',
          duration: 8,
        },
        {
          story_id: 2,
          story:
            'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg',
          duration: 7,
        },
      ],
    },
    {
      id: 5,
      profile_image_url:
        'https://randomuser.me/api/portraits/women/90.jpg',
      user_name: 'Emily Johnson',
      stories: [
        {
          story_id: 1,
          story:
            'https://images.pexels.com/photos/176127/pexels-photo-176127.jpeg',
          duration: 6,
        },
      ],
    },
  ];
  

const Stories = () => {
    const [seenStories, setSeenStories] = useState(new Set());

    const updateSeenStories = useCallback(({ story: { story_id } }) => {
      setSeenStories((prevSet) => new Set([...prevSet, story_id]));
    }, []);
  
    const handleSeenStories = useCallback(async (item) => {
        console.log(item, "story seen")
      }, [seenStories]);
    
  return (
    <View>


  
      </View>
  )
}

export default Stories

const styles = StyleSheet.create({});