import {
    StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const FeedImage = ({ mediaUrl, wWidth, hHeight, isTrue }) => {
    return (
        <>
            <FastImage
                style={isTrue ? { width: "100%", height: 500 } : { width: wWidth, height: hHeight }}
                source={{
                    uri: mediaUrl,
                    cache: FastImage.cacheControl.immutable, 
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </>
    )
}

export default FeedImage

const styles = StyleSheet.create({
})