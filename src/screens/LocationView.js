import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Animated
} from 'react-native';
import {Icon,Container} from 'native-base';
import {Marker,MapView} from 'react-native-amap3d';

export default class LocationView extends React.Component {
    static navigatorStyle = {
        statusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff",
        statusBarTextColorScheme: 'light'
    };
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isInitialized:false
        };
      }
    render() {
        const {region={}} = this.props;
        const {latitude,longitude} = region;
        let onViewLayout = (e) => {
            const layout = e.nativeEvent.layout;
            if (layout.height === 0) {
                return;
            }
            this.setState({
                isInitialized: true
            });
        };
        if(this.state.isInitialized){
            return (
                <MapView
                    zoomLevel={20}
                    showsZoomControls
                    showsLocationButton
                    coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
                    style={{flex:1}}>
                    <Marker
                        active
                        clickable={false}
                        coordinate={{latitude:parseFloat(latitude),longitude:parseFloat(longitude)}}
                    >
                        <View style={styles.custom}>
                            <View style={styles.customInfoWindow}>
                                <Text>{region.title}</Text>
                            </View>
                            <View style={styles.triangleDown}/>
                        </View>
                    </Marker>
                </MapView>
            )
        }
        return (
            <View style={{flex:1}} onLayout={onViewLayout} >
            </View>
        );
    }
}
const styles = StyleSheet.create({
    custom:{
        backgroundColor:'transparent',
        marginBottom: 5,
        alignItems:'center'
    },
    customInfoWindow: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 4,
        flex:1,
        padding:10
    },
    triangleDown:{
        width:0,
        height:0,
        borderLeftWidth:8,
        borderLeftColor:"transparent",
        borderRightWidth:8,
        borderRightColor:"transparent",
        borderTopWidth:16,
        borderTopColor:'#fff',
        alignSelf:'center'
    }
});
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
