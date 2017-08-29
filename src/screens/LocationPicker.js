import React from 'react';
import {
    StyleSheet,
    Dimensions,
} from 'react-native';

import RNGeolocation from 'react-native-amap-geolocation';
import Toast from 'react-native-simple-toast';
import Geocoder from 'react-native-geocoder';
import {MapView,Marker} from 'react-native-amap3d';

export default class LocationPicker extends React.Component {
    static navigatorStyle = {
        tabBarHidden: true,
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
            address:"loading...",
            feature:"",
            region:{
                latitude:0,
                longitude:0
            },
            coordinate:{
                latitude:0,
                longitude:0
            }
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    handleSend() {
        if (!this.state.coords) {
            Toast.show('获取当前位置失败');
            return;
        }
        this.props.onLocation && this.props.onLocation(this.state.coords);
        this.props.navigator.dismissModal();

    }
    getGeocoder({latitude,longitude}){
        let location = {lat:latitude, lng:longitude};
        this.setState({
            feature:'',
            address:'loading...',
            streetName:''
        });
        Geocoder.geocodePosition(location)
            .then((res) => {
                console.log("geocode position:", res);
                if (res.length > 0) {
                 this.setState({
                     feature:res[0].feature,
                     address:res[0].formattedAddress,
                     streetName:res[0].streetName,
                     coords:{
                         longitude:longitude+"",
                         latitude:latitude+"",
                         address:res[0].formattedAddress
                     }
                 });
                }
            })
            .catch(err => {
                console.log("geocode error:", err);
            })
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
        RNGeolocation.getLocation().then(data=>{
            if(data){
                this.setState({
                    region: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                    },
                    coordinate:{
                        latitude: data.latitude,
                        longitude: data.longitude,
                    },
                    title:"",
                    loading:false,
                });
                this.getGeocoder({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            }
        });
    }
    _onLocation = (e) => {
        let { longitude, latitude, } = e.nativeEvent;
        this.setState({
            coordinate: {
                latitude: latitude,
                longitude: longitude,
            }
        });
    }
    _onDragEnd= (e) => {
        let { longitude, latitude } = e.nativeEvent;
        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
            }
        });
        this.getGeocoder(e.nativeEvent)
    }
    renderMarker(){
        if(this.state.streetName || this.state.feature){
            return (
                <Marker
                    icon='green'
                    draggable
                    active
                    clickable={false}
                    onDragEnd={this._onDragEnd}
                    title={this.state.feature || this.state.streetName}
                    description={this.state.address}
                    coordinate={this.state.region}
                />
            )
        }
    }
    render() {

        return (
            <MapView
                showsZoomControls
                showsLocationButton
                zoomLevel={19}
                // locationEnabled
                // onLocation={this._onLocation}
                coordinate={this.state.coordinate}
                style={StyleSheet.absoluteFill}>
                {this.renderMarker()}
            </MapView>
        );
    }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
