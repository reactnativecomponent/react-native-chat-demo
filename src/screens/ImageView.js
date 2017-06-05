import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,TouchableOpacity
} from 'react-native';
import {Container} from 'native-base';
import Gallery from 'react-native-gallery';
//图片预览
export default class ImageView extends React.Component {
    static navigatorStyle = {
        tabBarHidden: true,
        statusBarHideWithNavBar:true,
        statusBarHidden:true,
        navBarHidden:true
    };
    render() {
        const {navigator,imageObj} = this.props;
        const images = [{
            url:imageObj.url
        }];
        return (
            <Gallery
                onSingleTapConfirmed={()=>navigator.pop()}
                style={{flex: 1, backgroundColor: 'black'}}
                images={[
                  imageObj.url
                ]}
            />
        );
    }
}
