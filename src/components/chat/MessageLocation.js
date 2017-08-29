import React from 'react';
import {
    Image,
    View,
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

//import MapView from 'react-native-maps';
//import AMap from 'react-native-smart-amap';
export default class MessageLocation extends React.Component {
    render() {
        const {locationObj} = this.props.currentMessage;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text
                        style={{color:'#666666',fontSize:12}}
                        numberOfLines={2}>
                        {locationObj.title}
                    </Text>
                </View>

                <Image  style={styles.mapView}
                        source={require("./Images/location.png")}>

                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 200
    },
    title:{
        backgroundColor:'#fff',flex:1,padding:5,
        borderTopRightRadius:5,
        borderTopLeftRadius:5
    },
    mapView: {
        width: 200,
        height: 100,
        borderBottomRightRadius:5,
        borderBottomLeftRadius:5
    }
});


