import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Animated,

} from 'react-native';
import {Icon,Container} from 'native-base';
import {Marker,MapView} from 'react-native-amap3d';

export default class LocationView extends React.Component {
    static navigatorStyle = {

        tabBarHidden: true,

        navBarButtonColor:"#fff",
        navBarTextColor:"#fff",
        statusBarTextColorScheme: 'light'
    };
    render() {
        const {region={}} = this.props;
        const {latitude,longitude} = region;
        return (
            <MapView
                zoomLevel={19}
                showsZoomControls
                showsLocationButton
                coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
                style={StyleSheet.absoluteFill}>
                <Marker
                    active
                    clickable={false}
                    icon='green'
                    description={region.title}
                    coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
                />
            </MapView>
        );
    }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
