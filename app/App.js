import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import Navigation from "./navigation/Navigation";
import Constants from "expo-constants";
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from "react-redux/dist/react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./redux/store";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';


export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    'SFPro-700': require('./assets/fonts/SF-Pro-Display-Bold.ttf'),
    'SFPro-600': require('./assets/fonts/SF-Pro-Display-Medium.ttf'),
    'SFPro-400': require('./assets/fonts/SF-Pro-Display-Regular.ttf')
  })

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const connect = async () => {
    const pusher = Pusher.getInstance();
    await pusher.init({
      apiKey: "c2eb0f7a40e0adc87f99",
      cluster: "us2"
    });
    await pusher.connect();
    await pusher.subscribe({
      channelName: "friends", 
      onEvent: (event) => {
        console.log(`Event received: ${event}`);
      }
    });
  }

  connect();
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {/* <SafeAreaView> */}
        <View style={styles.container} >
          <StatusBar style="dark" />
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </View>
        {/* </SafeAreaView> */}
      </Provider>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: Platform.OS === 'android' || Constants.statusBarHeight,
  },
});