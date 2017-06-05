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
//import AMap from 'react-native-smart-amap';

export default class LocationView extends React.Component {
    static navigatorStyle = {
        statusBarColor: '#fc513a',
        tabBarHidden: true,
        navBarBackgroundColor:"#fc513a",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff",
        statusBarTextColorScheme: 'light'
    };
    render() {
        const {region} = this.props;
        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                <AMap
                    style={{flex: 1}}
                    options={{
                                frame: {
                                    width: deviceWidth,
                                    height: deviceHeight
                                },
                                showsUserLocation: false,
                                userTrackingMode: Platform.OS == 'ios' ? AMap.constants.userTrackingMode.none : null,
                                centerCoordinate: {
                                    longitude:Number(region.latitude),
                                    latitude:Number(region.longitude)
                                },
                                zoomLevel: 18.1,
                                isMarker:true,
                                centerMarker: Platform.OS == 'ios' ? 'redPin' : 'poi_marker',
                            }}
                />
                {/*<TouchableOpacity
                    onPress={()=>this.props.navigator.pop()}
                   style={{position:'absolute',left:15,top:25,width:36,height:36,backgroundColor:'rgba(0,0,0,0.5)',
                borderRadius:18,justifyContent:'center',alignItems:'center'}}>
                    <Icon name="md-arrow-back" style={{color:'#fff',fontSize:25}}/>
                </TouchableOpacity>*/}
            </Container>
        );
    }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;