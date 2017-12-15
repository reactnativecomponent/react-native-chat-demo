import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Platform,
    View,
    Text
} from 'react-native';

import RNGeolocation from 'react-native-amap-geolocation';
import {Container} from 'native-base';
import Toast from 'react-native-simple-toast';
import {MapView,Marker} from 'react-native-amap3d';

export default class LocationPicker extends React.Component {
    static navigatorStyle = {
        statusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff",
        statusBarTextColorScheme: 'light',
    };
    static navigatorButtons = {
        leftButtons:[
            {
                title:'取消',
                id:'cancel'
            }
        ],
        rightButtons: [
            {
                title: '发送',
                id: 'send',
                showAsAction: 'ifRoom'
            }
        ]
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isInitialized:false,
            address:null,
            title:"",
            region:{
                latitude:23.121278,longitude:113.326536
            },
            coordinate:{
                latitude:23.121278,longitude:113.326536
            }
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    handleSend() {
        if (!this.state.region || !this.state.region.latitude || !this.state.address) {
            Toast.show('获取当前位置失败');
            return;
        }
        this.props.onLocation && this.props.onLocation({
            latitude: this.state.region.latitude+"",
            longitude:this.state.region.longitude+"",
            address:this.state.address
        });
        this.props.navigator.dismissModal();
    }
    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'send') {
                this.handleSend();
            }
            if (event.id === 'cancel') {
                this.props.navigator.dismissModal();
            }
        }
    }
    componentWillMount() {

    }
    _onDragEnd= (e) => {
        let { longitude, latitude } = e.nativeEvent;
        RNGeolocation.getAddress({lat:latitude,lng:longitude}).then((data)=>{
            this.setState({
                region: {
                    latitude: latitude,
                    longitude: longitude,
                },
                title:data.pois.name || data.street,
                address:data.address,
                loading:false,
            });
        })
    }
    renderMarker(){
        if(!!this.state.address){
            return (
                <Marker
                    draggable
                    active
                    centerOffset={{x:0,y:18}}
                    clickable={false}
                    onDragEnd={this._onDragEnd}
                    title={this.state.title}
                    // description={this.state.address}
                    coordinate={this.state.region}
                >
                    <View style={styles.custom}>
                        <View style={styles.customInfoWindow}>
                            <Text style={{fontWeight:"600",lineHeight:25}}>{this.state.title}</Text>
                            <Text>{this.state.address}</Text>
                        </View>
                        <View style={styles.triangleDown}/>
                    </View>
                </Marker>
            )
        }
        return null;
    }
    render() {
        let onViewLayout = (e) => {
            const layout = e.nativeEvent.layout;
            if (layout.height === 0) {
                return;
            }
            this.setState({
                isInitialized: true
            });
            RNGeolocation.getLocation().then(result=>{
                RNGeolocation.getAddress({lat:result.latitude,lng:result.longitude}).then((data)=>{
                    this.setState({
                        region: {
                            latitude: result.latitude,
                            longitude: result.longitude,
                        },
                        coordinate:{
                            latitude: result.latitude,
                            longitude: result.longitude,
                        },
                        title:data.pois.name || data.street,
                        address:data.address,
                        loading:false,
                    });
                })
            });
        };
        if(this.state.isInitialized) {
            return (
                <MapView
                    showsZoomControls
                    showsLocationButton
                    zoomLevel={20}
                    coordinate={this.state.coordinate}
                    style={StyleSheet.absoluteFill}>
                    {this.renderMarker()}
                </MapView>
            );
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
        paddingHorizontal:10,
        paddingBottom:10,
        paddingTop:5
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
