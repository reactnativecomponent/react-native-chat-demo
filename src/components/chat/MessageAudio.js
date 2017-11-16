import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,Platform
} from 'react-native';

export default class MessageAudio extends React.Component {
    render() {

        let msg = this.props.currentMessage;
        //var playing;
        //if (msg.playing == undefined) {
        //    playing = 0;
        //} else {
        //    playing = msg.playing;
        //}
        let image = "";

        if (msg.playing) {
            image = msg.isOutgoing ? require("./Images/senderVoicePlaying.gif") :
                    require("./Images/receiverVoicePlaying.gif");
        }else {
            image = msg.isOutgoing ? require("./Images/senderVoice.png") :
                require("./Images/receiverVoice.png");
        }

        //max 180
        var margin = (parseFloat(msg.extend.duration)/1000)*3;
        margin = Math.min(180, margin)+10;
        return (
            <View style={[styles.container]}>

                <Image style={[styles.image,msg.isOutgoing ? {marginLeft:margin} : { marginRight:margin}]}
                       source={image}>
                </Image>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flex:1,
        alignItems:'center'
    },
    image: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        width:20,
        height:20        
    }
});

