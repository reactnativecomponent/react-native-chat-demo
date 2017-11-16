import React from 'react';
import {
    Clipboard,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Image,
    View,
    Text,Platform
} from 'react-native';

import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageAudio from './MessageAudio';
import MessageLocation from './MessageLocation';
import Time from './Time';

import {MESSAGE_FLAG_FAILURE, MESSAGE_FLAG_LISTENED} from './IMessage';
import PropTypes from 'prop-types';
export default class Bubble extends React.Component {
    constructor(props) {
        super(props);
        this.onLongPress = this.onLongPress.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    handleBubbleToNext() {
        if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
            return StyleSheet.flatten([styles[this.props.position].containerToNext, this.props.containerToNextStyle[this.props.position]]);
        }
        return null;
    }

    handleBubbleToPrevious() {
        if (this.props.isSameUser(this.props.currentMessage, this.props.previousMessage) && this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            return StyleSheet.flatten([styles[this.props.position].containerToPrevious, this.props.containerToPreviousStyle[this.props.position]]);
        }
        return null;
    }

    renderMessageText() {
        if (this.props.currentMessage.msgType === 'text') {
            const {containerStyle, wrapperStyle, ...messageTextProps} = this.props;
            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            return <MessageText {...messageTextProps}/>;
        }
        return null;
    }

    renderMessageImage() {
        if (this.props.currentMessage.msgType === 'image' && this.props.currentMessage.extend) {
            const {containerStyle, wrapperStyle, ...messageImageProps} = this.props;
            if (this.props.renderMessageImage) {
                return this.props.renderMessageImage(messageImageProps);
            }
            return <MessageImage {...messageImageProps}/>;
        }
        return null;
    }

    renderMessageAudio() {
        if (this.props.currentMessage.msgType === 'voice') {
            console.log("render message auido");
            return <MessageAudio {...this.props}/>;
        }
    }

    renderMessageLocation() {
        if (this.props.currentMessage.msgType === 'location') {
            console.log("render message location");
            return <MessageLocation {...this.props}/>;
        }
    }
    
    renderTime() {
        if (this.props.currentMessage.createdAt) {
            const {containerStyle, wrapperStyle, ...timeProps} = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return <Time {...timeProps}/>;
        }
        return null;
    }

    onLongPress() {
        if (this.props.onMessageLongPress) {
            this._root.measureInWindow((x, y, width, height) => {
                this.props.onMessageLongPress({
                    x:x,
                    y:y,
                    width:width,
                    height:height
                },this.props.currentMessage);

            })

        }
    }

    onPress() {
        if (this.props.onMessagePress) {
            this.props.onMessagePress(this.props.currentMessage);
        }
    }

    //发送失败标志
    renderFlags() {
        const msg = this.props.currentMessage;
        if (this.props.user._id === this.props.currentMessage.fromUser._id) {
            if (msg.status === 'send_failed') {
                return (
                    <Image style={{alignSelf:"flex-end", width:20, height:20}}
                           source={require('./Images/MessageSendError.png')}>
                    </Image>
                );
            }
        }

        if (!msg.isOutgoing && msg.msgType === 'voice') {
            if (!(msg.flags & MESSAGE_FLAG_LISTENED)) {
                return (
                    <View style={{marginLeft:4, justifyContent:"space-between"}}>
                        
                        <View style={{backgroundColor:"red",
                                      width:8,
                                      height:8,
                                      borderRadius:90}}/>

                        <Text style={{color:"lightgrey"}}>
                            {"" + msg.extend.duration + "''"}
                        </Text>
                    </View>
                );
            } else {
                return (
                    <View style={{marginLeft:4, justifyContent:"flex-end"}}>
                        <Text style={{color:"lightgrey"}}>
                            {"" + msg.extend.duration + "''"}
                        </Text>
                    </View>
                );                
            }
        }

        if (msg.isOutgoing && msg.msgType === "voice") {
            return (
                <View style={{marginRight:4, justifyContent:"flex-end"}}>
                    <Text style={{color:"lightgrey"}}>
                        {"" + msg.extend.duration + "''"}
                    </Text>
                </View>
            );                
        }
    }
    _renderContent(){
        if(Platform.OS === 'android'){
            return (
                <TouchableNativeFeedback
                    delayLongPress={2000}
                    onLongPress={this.onLongPress}
                    onPress={this.onPress}
                    {...this.props.touchableProps}
                >
                    <View ref={component => this._root = component}>
                        {this.renderMessageImage()}
                        {this.renderMessageText()}
                        {this.renderMessageAudio()}
                        {this.renderMessageLocation()}
                        {/*this.renderTime()*/}
                    </View>
                </TouchableNativeFeedback>
            )
        }
        return (
            <TouchableWithoutFeedback
                onLongPress={this.onLongPress}
                onPress={this.onPress}
                {...this.props.touchableProps}
            >
                <View ref={component => this._root = component}>
                    {this.renderMessageImage()}
                    {this.renderMessageText()}
                    {this.renderMessageAudio()}
                    {this.renderMessageLocation()}
                    {/*this.renderTime()*/}
                </View>
            </TouchableWithoutFeedback>
        )
    }
    renderLeft() {
        return (
            <View style={[styles['left'].container, this.props.containerStyle['left']]}>
                <View style={[styles['left'].wrapper, this.props.wrapperStyle['left']]}>
                    {this._renderContent()}
                </View>

                {this.renderFlags()}
            </View>
        );        
    }
    renderAudoDuration(){
        const msg = this.props.currentMessage;
        if (msg.msgType === 'voice') {
            return (
                <Text style={{color:'#666666',fontSize:12,lineHeight:25}}> {parseInt((msg.extend.duration)/1000)}'' </Text>
            );

        }
    }
    renderRight() {
        return (
            <View style={[styles['right'].container, this.props.containerStyle['right']]}>
                {this.renderFlags()}

                <View style={[styles['right'].wrapper, this.props.wrapperStyle['right']]}>
                    {this._renderContent()}
                </View>
            </View>
        );        
    }

    renderCenter() {
        let msg = this.props.currentMessage;
        if(msg.msgType === 'notification'){
            return (
                <View style={{alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 5,
                          marginBottom: 10}}>
                    <View style={{backgroundColor:'#cecece',borderRadius:5,paddingHorizontal:5,paddingVertical:3 }}>
                        <Text style={{
                                  color: '#fff',
                                  fontSize: 12,
                                  fontWeight: '400',}}>
                            {msg.extend.tipMsg}
                        </Text>
                    </View>
                </View>
            );
        }
        return null;

    }
    
    render() {
        if (this.props.position === 'left') {
            return this.renderLeft();
        } else if (this.props.position === 'right') {
            return this.renderRight();
        } else if (this.props.position === 'center') {
            return this.renderCenter();
        } else {
            return null;
        }
    }
}

const styles = {
    left: StyleSheet.create({
        container: {
            flex: 1,
            marginRight: 60,
            flexDirection:"row",
            justifyContent:"flex-start",
        },
        wrapper: {
            borderRadius: 5,
            backgroundColor: '#f0f0f0',
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomLeftRadius: 3,
        },
        containerToPrevious: {
            borderTopLeftRadius: 3,
        },
    }),
    right: StyleSheet.create({
        container: {
            flex: 1,
            marginLeft: 60,
            flexDirection:"row",
            justifyContent:"flex-end",
        },
        wrapper: {
            borderRadius: 5,
            backgroundColor: '#238dfa',
            minHeight: 20,
            justifyContent: 'flex-end',
        },
        containerToNext: {
            borderBottomRightRadius: 3,
        },
        containerToPrevious: {
            borderTopRightRadius: 3,
        },
    }),
};

Bubble.contextTypes = {
    actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    renderMessageImage: null,
    renderMessageText: null,
    renderCustomView: null,
    renderTime: null,
    isSameUser: () => {},
    isSameDay: () => {},
    position: 'left',
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};

Bubble.propTypes = {
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderTime: PropTypes.func,
    isSameUser: PropTypes.func,
    isSameDay: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right', 'center']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
    wrapperStyle: PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
    containerToNextStyle: PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: View.propTypes.style,
        right: View.propTypes.style,
    }),
};
