import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Image,
    ActivityIndicator,
    Keyboard,
    LayoutAnimation,
    TouchableOpacity,
    TouchableWithoutFeedback,
    InteractionManager,
    Clipboard,
    Easing,
    UIManager,
    Animated,
    NativeAppEventEmitter
} from 'react-native';

//import EleRNLocation from 'ele-react-native-location';
//import AMap from 'react-native-smart-amap';
import Toast from 'react-native-simple-toast';
//import Geocoder from 'react-native-geocoder';

export default class LocationPicker extends React.Component {
    static navigatorStyle = {
        StatusBarColor: '#fc513a',
        tabBarHidden: true,
        navBarBackgroundColor:"#fc513a",
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
            title:"",
            description:"",
            region:{}
        };
        this._amap = null;

        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    handleSend() {
        if (!this.state.region) {
            return;
        }

        const {region} = this.state;
        var location = {lat:region.latitude, lng:region.longitude};
        Geocoder.geocodePosition(location)
            .then((res) => {
                console.log("geocode position:", res);
                if (res.length > 0) {
                    var coords = {
                        longitude:this.state.region.longitude+"",
                        latitude:this.state.region.latitude+"",
                        address:res[0].formattedAddress
                    };

                    this.props.onLocation && this.props.onLocation(coords);
                    this.props.navigator.dismissModal();

                    //console.log("location addresses:", res[0].formattedAddress, res[0]);
                    //if (this.state.region.longitude == location.lng &&
                    //    this.state.region.latitude == location.lat) {
                    //    this.setState({title:res[0].streetName,
                    //        description:res[0].formattedAddress});
                    //}
                }
            })
            .catch(err => {
                console.log("geocode error:", err);
            })

    }
    
    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') { 
            if (event.id == 'send') {
                this.handleSend();
            }
            if (event.id == 'cancel') {
                this.props.navigator.dismissModal();
            }
        }
    }
    
    componentWillMount() {

        this.listener = EleRNLocation.addEventListener((data) => {
            console.log(data)
            if(data && data.latitude){
               this.setState({
                   region: {
                       latitude: data.latitude,
                       longitude: data.longitude,
                   },
                   title:"",
                   loading:false,
               });
            }
        });
        EleRNLocation.startLocation({
            onceLocation:true,
            interval: 2000,
        });
    }
    componentWillUnmount() {
        EleRNLocation.stopLocation();
        this.listener && this.listener.remove();
    }

    _onDidMoveByUser = (e) => {

        let { longitude, latitude, } = e.nativeEvent.data.centerCoordinate;
        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
            },
            title:"",
            loading:false,
        });
        //this._amap.setCenterCoordinate({
        //    latitude: latitude,
        //    longitude: longitude,
        //})
    }

    render() {
        if (this.state.loading || !this.state.region.longitude) {
            return (
                <View  style={{flex:1,backgroundColor:'#f7f7f7',
                               alignItems: 'center',
                               justifyContent: 'center'}}>
                    <ActivityIndicator
                        animating={true}
                        size="large"/>

                </View>
            );
        } else {
            return (
                <AMap
                    ref={ component => this._amap = component }
                    style={{flex: 1,backgroundColor:'#f7f7f7' }}
                    options={{
                            frame: {
                                width: deviceWidth,
                                height: (deviceHeight - 64)
                            },
                            showsUserLocation: false,
                            userTrackingMode: Platform.OS == 'ios' ? AMap.constants.userTrackingMode.none : null,
                            centerCoordinate: {
                                longitude:this.state.region.longitude,
                                latitude:this.state.region.latitude
                            },
                            zoomLevel: 18.1,
                            centerMarker: Platform.OS == 'ios' ? 'redPin' : 'poi_marker',
                        }}
                    onDidMoveByUser={this._onDidMoveByUser}
                />
            );
        }
    }
}
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
