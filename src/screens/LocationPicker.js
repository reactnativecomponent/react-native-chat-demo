/*
 * @选择位置
 * @Author: huangjun
 * @Date: 2018-10-10 16:21:39
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:07:01
 */
import React from 'react';
import {StyleSheet, View, Text, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-amap-geolocation';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {MapView, Marker} from 'react-native-amap3d';

export default class LocationPicker extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '选择位置',
    headerLeft: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="取消"
          color="#037aff"
          onPress={() => navigation.pop()}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons color="#037aff">
        <HeaderButtons.Item
          title="发送"
          color="#037aff"
          onPress={navigation.getParam('handlerSend')}
        />
      </HeaderButtons>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      isInitialized: false,
      address: null,
      title: '',
      region: {
        latitude: 23.121278,
        longitude: 113.326536,
      },
      coordinate: {
        latitude: 23.121278,
        longitude: 113.326536,
      },
    };
  }

  handleSend = () => {
    const {navigation} = this.props;
    const {onLocation} = navigation.state.params;
    if (
      !this.state.region ||
      !this.state.region.latitude ||
      !this.state.address
    ) {
      RNToasty.Show({
        title: '获取当前位置失败',
      });
      return;
    }
    onLocation &&
      onLocation({
        latitude: `${this.state.region.latitude}`,
        longitude: `${this.state.region.longitude}`,
        address: this.state.address,
      });
    navigation.pop();
  };
  componentDidMount() {
    this.props.navigation.setParams({
      handlerSend: this.handleSend,
    });
  }
  async getLocation() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await Geolocation.init({
        ios: '',
        android: '',
      });

      Geolocation.setOptions({
        interval: 8000,
        distanceFilter: 20,
      });

      Geolocation.addLocationListener((location) => {
        this.setState({
          region: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          coordinate: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          title: location.poiName,
          address: location.address,
        });
      });
      Geolocation.start();
    }
  }
  _onDragEnd = (e) => {
    const {longitude, latitude} = e.nativeEvent;
    this.setState({
      region: {
        latitude,
        longitude,
      },
      // title: data.pois.name || data.street,
      // address: data.address,
    });
  };
  renderMarker() {
    if (this.state.address) {
      return (
        <Marker
          draggable
          active
          centerOffset={{x: 0, y: 18}}
          clickable={false}
          onDragEnd={this._onDragEnd}
          title={this.state.title}
          // description={this.state.address}
          coordinate={this.state.region}>
          <View style={styles.custom}>
            <View style={styles.customInfoWindow}>
              <Text style={{fontWeight: '600', lineHeight: 25}}>
                {this.state.title}
              </Text>
              <Text>{this.state.address}</Text>
            </View>
            <View style={styles.triangleDown} />
          </View>
        </Marker>
      );
    }
    return null;
  }
  render() {
    const onViewLayout = (e) => {
      const {layout} = e.nativeEvent;
      if (layout.height === 0) {
        return;
      }
      this.setState({
        isInitialized: true,
      });
    };
    if (this.state.isInitialized) {
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
    return <View style={{flex: 1}} onLayout={onViewLayout} />;
  }
}
const styles = StyleSheet.create({
  custom: {
    backgroundColor: 'transparent',
    marginBottom: 5,
    alignItems: 'center',
  },
  customInfoWindow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  triangleDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderTopWidth: 16,
    borderTopColor: '#fff',
    alignSelf: 'center',
  },
});
