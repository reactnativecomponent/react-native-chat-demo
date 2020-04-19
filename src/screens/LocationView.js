/*
 * @查看位置
 * @Author: huangjun
 * @Date: 2018-10-10 16:21:34
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 15:13:41
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Marker, MapView} from 'react-native-amap3d';

export default class LocationView extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: '查看位置',
  });
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      isInitialized: false,
    };
  }
  render() {
    const {region = {}} = this.props.navigation.state.params;
    const {latitude, longitude} = region;
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
          zoomLevel={20}
          showsZoomControls
          showsLocationButton
          coordinate={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          style={{flex: 1}}>
          <Marker
            active
            clickable={false}
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}>
            <View style={styles.custom}>
              <View style={styles.customInfoWindow}>
                <Text>{region.title}</Text>
              </View>
              <View style={styles.triangleDown} />
            </View>
          </Marker>
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
    padding: 10,
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
