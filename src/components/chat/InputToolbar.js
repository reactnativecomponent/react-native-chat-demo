import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Dimensions,
    TextInput,
    Image,
    ActivityIndicator,
    Keyboard,
    LayoutAnimation,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    TouchableHighlight

} from 'react-native';
import {Icon} from 'native-base';
import Emoji from 'react-native-emoji'
import Swiper from 'react-native-swiper'
import {Images, Colors, Metrics} from './Themes'
import Styles from './Styles/MessageScreenStyle'

import NIM from 'react-native-netease-im';
var spliddit = require('spliddit');
var emoji = require("./emoji");

const MODE_TEXT = "mode_text";
const MODE_RECORD = "mode_record";

//输入框初始高度
const MIN_COMPOSER_HEIGHT = Platform.select({
    ios: 34,
    android: 41,
});
const MAX_COMPOSER_HEIGHT = 100;

export const MIN_INPUT_TOOLBAR_HEIGHT = Platform.select({
    ios: 44,
    android: 54,
});

const ACTION_BUTTON_HEIGHT = 220;
const EMOJI_HEIGHT = 190;

export default class InputToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: MODE_TEXT,
            opacity: "#fff",
            focused: false,
            isEmoji: false,
            value: '',
            actionVisible: false,
            actionAnim: new Animated.Value(0)
        };

        this.composerHeight = MIN_COMPOSER_HEIGHT;
        this.actionBarHeight = 0;
    }


    getToolbarHeight() {
        var h = this.composerHeight + (MIN_INPUT_TOOLBAR_HEIGHT - MIN_COMPOSER_HEIGHT) + this.actionBarHeight;
        return h;
    }

    dismiss() {
        const {isEmoji, actionVisible} = this.state;
        this.setState({
            isEmoji: false,
            actionVisible: false,
        });
        Animated.timing(
            this.state.actionAnim,
            {toValue: 0}
        ).start();

        if (isEmoji || actionVisible) {
            this.actionBarHeight = 0;
            this.onHeightChange();
        }
    }

    handleSend() {
        this.props.onSend(this.state.value);
        if (this.composerHeight != MIN_COMPOSER_HEIGHT) {
            this.composerHeight = MIN_COMPOSER_HEIGHT;
            this.onHeightChange();
        }
        this.setState({value: ''});
    }

    onActionsPress() {
        var actionVisible = this.state.actionVisible;
        if (actionVisible) {
            if (this.search) {
                this.search.focus();
            }
            Animated.timing(
                this.state.actionAnim,
                {toValue: 0}
            ).start();
            return;
        }
        if (this.search) {
            this.search.blur();
        }
        actionVisible = !actionVisible;
        this.setState({actionVisible: actionVisible, isEmoji: false});
        if (actionVisible) {
            this.actionBarHeight = ACTION_BUTTON_HEIGHT;
            this.onHeightChange();
        }
        Animated.timing(
            this.state.actionAnim,
            {toValue: 1}
        ).start();
    }

    handleEmojiOpen() {
        var isEmoji = this.state.isEmoji;
        isEmoji = !isEmoji;
        if (this.search) {
            this.search.blur();
        }
        if (isEmoji) {
            this.actionBarHeight = EMOJI_HEIGHT;
            this.onHeightChange();
        } else {
            this.actionBarHeight = 0;
            if (this.search) {
                this.search.focus();
            }
        }
        this.setState({
            isEmoji: isEmoji,
            actionVisible: false,
            mode: MODE_TEXT
        });
        Animated.timing(          // Uses easing functions
            this.state.actionAnim,    // The value to drive
            {toValue: 1}           // Configuration
        ).start();
    }

    handleEmojiClick(v) {
        var newValue = (this.state.value || '') + v;
        this.setState({
            value: newValue
        });
    }

    handleEmojiCancel() {
        if (!this.state.value) return;
        const arr = spliddit(this.state.value);
        let newValue = '';
        arr.pop();
        newValue = arr.join('');
        this.setState({
            value: newValue
        });
        this.value = newValue;
    }

    handleFocusSearch() {
        this.setState({
            isEmoji: false,
            actionVisible: false,
            focused: true,
        });
        Animated.timing(
            this.state.actionAnim,
            {toValue: 1}
        ).start();
    }

    handleBlurSearch() {
        this.setState({focused: false});
    }

    handleChangeText(v) {
        if (v.length > 0 && v[v.length - 1] == '\n') {
            this.props.onSend(v);
            if (this.composerHeight != MIN_COMPOSER_HEIGHT) {
                this.composerHeight = MIN_COMPOSER_HEIGHT;
                this.onHeightChange();
            }
            this.setState({value: ''});
        } else {
            this.setState({
                value: v,
            });
        }
    }

    handleImagePicker() {
        this.setState({
            isEmoji: false,
            actionVisible: false
        });

        this.actionBarHeight = 0;
        this.onHeightChange();


        this.props.giftedChat.handleImagePicker();
    }

    handleCameraPicker() {

        this.setState({
            isEmoji: false,
            actionVisible: false
        });

        this.actionBarHeight = 0;
        this.onHeightChange();


        this.props.giftedChat.handleCameraPicker();
    }

    handleLocationClick() {
        console.log("locaiton click");

        this.setState({
            isEmoji: false,
            actionVisible: false
        });

        this.actionBarHeight = 0;
        this.onHeightChange();

        this.props.giftedChat.handleLocationClick();
    }

    handleRecordMode() {
        const {isEmoji, actionVisible} = this.state;
        if (this.state.mode == MODE_RECORD) {
            return;
        }
        this.setState({
            isEmoji: false,
            actionVisible: false,
            focused: false,
            mode: MODE_RECORD
        });
        if (isEmoji || actionVisible) {
            this.actionBarHeight = 0;
            this.onHeightChange();
        }
        NIM.onTouchVoice();
    }

    handleTextMode() {
        if (this.state.mode == MODE_TEXT) {
            return;
        }
        this.setState({mode: MODE_TEXT, focused: true,});

    }

    _renderEmoji() {
        const {isEmoji, focused} = this.state;
        const emojiStyle = [];
        const rowIconNum = 7;
        const emojis = Object.keys(emoji.map).map((v, k) => {
            const name = emoji.map[v]
            return (
                <TouchableOpacity key={v + k} onPress={() => {
                        this.handleEmojiClick(v)
                    }}>
                    <Text style={[Styles.emoji, emojiStyle]}><Emoji name={name}/></Text>
                </TouchableOpacity>
            )
        });
        return <Animated.View style={[Styles.emojiRow,{opacity:this.state.actionAnim,transform:[{
     translateY: this.state.actionAnim.interpolate({
       inputRange: [0, 1],
       outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
     })}]}]}>
            <Swiper style={Styles.wrapper} loop={false}
                    height={EMOJI_HEIGHT-35}
                    dotStyle={ {bottom: -25} }
                    activeDotStyle={ {bottom: -25} }
            >
                <View style={Styles.slide}>
                    <View style={Styles.slideRow}>
                        {emojis.slice(0, rowIconNum)}
                    </View>
                    <View style={Styles.slideRow}>
                        {emojis.slice(1 * rowIconNum, rowIconNum * 2)}
                    </View>
                    <View style={Styles.slideRow}>
                        {emojis.slice(2 * rowIconNum, rowIconNum * 3 - 1)}
                        <TouchableOpacity onPress={this.handleEmojiCancel.bind(this)}>
                            <Icon name="ios-backspace-outline"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={Styles.slide}>
                    <View style={Styles.slideRow}>
                        {emojis.slice(3 * rowIconNum - 1, rowIconNum * 4 - 1)}
                    </View>
                    <View style={Styles.slideRow}>
                        {emojis.slice(4 * rowIconNum - 1, rowIconNum * 5 - 1)}
                    </View>
                    <View style={Styles.slideRow}>
                        {emojis.slice(5 * rowIconNum - 1, rowIconNum * 6 - 1)}
                        <TouchableOpacity onPress={this.handleEmojiCancel.bind(this)}>
                            <Icon name="ios-backspace-outline"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Swiper>
            <View style={{height:35,flexDirection:'row'}}>
                <View style={{flex:1}}>

                </View>
                <TouchableOpacity onPress={()=>this.handleSend()}
                                  style={{backgroundColor:'#d82614',justifyContent:'center',alignItems:'center',width:55}}>
                    <Text style={{color:'#fff'}}>发送</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    }

    _renderActions() {
        return (
            <Animated.View style={[Styles.iconRow,{height:ACTION_BUTTON_HEIGHT},{opacity:this.state.actionAnim,transform:[{
     translateY: this.state.actionAnim.interpolate({
       inputRange: [0, 1],
       outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
     })}]}]}>

                <View style={{alignItems:"center",marginRight:20}}>
                    <TouchableOpacity style={Styles.iconTouch} onPress={this.handleCameraPicker.bind(this)}>
                        <Icon name="ios-image-outline"/>
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>拍照</Text>
                </View>
                <View style={{alignItems:"center",marginRight:20}}>
                    <TouchableOpacity style={Styles.iconTouch} onPress={this.handleImagePicker.bind(this)}>
                        <Icon name="ios-image-outline"/>
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>相册</Text>
                </View>
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity style={Styles.iconTouch} onPress={this.handleLocationClick.bind(this)}>
                        <Icon name="ios-image-outline"/>
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>位置</Text>
                </View>
            </Animated.View>
        );
    }

    onHeightChange() {
        var h = this.composerHeight + (MIN_INPUT_TOOLBAR_HEIGHT - MIN_COMPOSER_HEIGHT) + this.actionBarHeight;
        console.info('inptu height', h)
        this.props.onHeightChange(h);
    }

    onChange(e) {
        let newComposerHeight = null;
        if (e.nativeEvent && e.nativeEvent.contentSize) {
            newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, e.nativeEvent.contentSize.height));
        } else {
            newComposerHeight = MIN_COMPOSER_HEIGHT;
        }
        if (this.composerHeight != newComposerHeight) {
            this.composerHeight = newComposerHeight;
            this.onHeightChange();
        }
    }

    renderTextInput() {
        const {value = '', isEmoji, mode} = this.state;
        var height = this.composerHeight + (MIN_INPUT_TOOLBAR_HEIGHT - MIN_COMPOSER_HEIGHT);
        return (
            <View style={[Styles.inputRow, {height:height}]}>
                <TouchableOpacity style={{alignSelf:"stretch",justifyContent:"center",paddingLeft:8}}
                                  onPress={this.handleRecordMode.bind(this)}>
                    <Image source={require('./Images/chatBar_record.png')}/>
                </TouchableOpacity>

                <View style={Styles.searchRow}>
                    <TextInput
                        ref={(search)=> {this.search = search} }
                        style={[Styles.searchInput, {height: this.composerHeight}]}
                        value={value}
                        autoFocus={this.state.focused}
                        editable={true}
                        keyboardType='default'
                        returnKeyType='send'
                        autoCapitalize='none'
                        autoCorrect={false}
                        multiline={true}
                        onChange={this.onChange.bind(this)}
                        onFocus={this.handleFocusSearch.bind(this)}
                        onBlur={this.handleBlurSearch.bind(this)}
                        onChangeText={this.handleChangeText.bind(this)}
                        underlineColorAndroid='transparent'
                    />
                </View>
                { this._renderEmojiButton() }
                { this._renderSendButton() }
            </View>
        );
    }

    handleLayout(e) {

        this.refs.record.measure((x, y, w, h, px, py) => {
            console.log("record measure:", x, y, w, h, px, py);
            this.recordPageX = px;
            this.recordPageY = py;
        });
    }

    renderReocrdInput() {
        const {value = '', isEmoji, mode, opacity} = this.state;
        var height = this.composerHeight + (MIN_INPUT_TOOLBAR_HEIGHT - MIN_COMPOSER_HEIGHT);
        //android bug: https://github.com/facebook/react-native/issues/7221
        var responder = {
            onStartShouldSetResponder: (evt) => true,
            onMoveShouldSetResponder: (evt) => true,
            onResponderGrant: (evt) => {
                this.setState({opacity: "#c9c9c9"});
                this.props.giftedChat.setRecording(true);
                this.props.giftedChat.setRecordingText("手指上滑, 取消发送");
                this.props.giftedChat.setRecordingColor("transparent");
                this.props.giftedChat.startRecording();
            },
            onResponderReject: (evt) => {
            },
            onResponderMove: (evt) => {
                if (evt.nativeEvent.locationY < 0 ||
                    evt.nativeEvent.pageY < this.recordPageY) {
                    this.props.giftedChat.setRecordingText("松开手指, 取消发送");
                    this.props.giftedChat.setRecordingColor("red");
                } else {
                    this.props.giftedChat.setRecordingText("手指上滑, 取消发送");
                    this.props.giftedChat.setRecordingColor("transparent");
                }
            },
            onResponderRelease: (evt) => {
                this.setState({opacity: "#fff"});
                this.props.giftedChat.setRecording(false);
                var canceled;
                if (evt.nativeEvent.locationY < 0 ||
                    evt.nativeEvent.pageY < this.recordPageY) {
                    canceled = true;
                } else {
                    canceled = false;
                }
                this.props.giftedChat.stopRecording(canceled);
            },
            onResponderTerminationRequest: (evt) => true,
            onResponderTerminate: (evt) => {
                console.log("responder terminate")
            },

        };
        return (
            <View style={[Styles.inputRow, {height:height}]}>
                <TouchableOpacity style={{alignSelf:"stretch",justifyContent:"center", paddingLeft:8}}
                                  onPress={this.handleTextMode.bind(this)}>
                    <Image source={require('./Images/chatBar_keyboard.png')}/>
                </TouchableOpacity>

                <View style={[Styles.searchRow, {padding:4}]}>
                    <View
                        ref="record"
                        {...responder}
                        style={{flex:1,
                        justifyContent:'center',
                        alignItems:'center',
                        borderRadius:5,
                        backgroundColor:this.state.opacity,
                        borderWidth:1,borderColor:'#f2f2f2'
                        }}
                        onLayout={this.handleLayout.bind(this)}

                    >
                        <Text>按住 说话</Text>
                    </View>
                </View>
                { this._renderEmojiButton() }
                { this._renderSendButton() }
            </View>
        );
    }

    _renderEmojiButton() {
        const {isEmoji} = this.state;
        return (
            <TouchableOpacity style={{paddingLeft:5,
                                      paddingRight:5,
                                      alignSelf:"stretch",
                                      justifyContent:"center"}}
                              onPress={this.handleEmojiOpen.bind(this)}>
                {
                    isEmoji ? <Image source={require('./Images/chatBar_keyboard.png')}/>
                        : <Icon name="ios-happy-outline"/>
                }
            </TouchableOpacity>
        )
    }

    _renderSendButton() {
        const {focused, value} = this.state;

        return ((focused && value.length > 0) && Platform.OS === 'android') ? (
            <TouchableOpacity style={{alignSelf:"stretch",justifyContent:"center",paddingRight:8}}
                              onPress={this.handleSend.bind(this)}>
                <Text style={Styles.sendText}>{'发送'}</Text>
            </TouchableOpacity>

        ) : (
            <TouchableOpacity style={{alignSelf:"stretch",justifyContent:"center",paddingRight:8}}
                              onPress={this.onActionsPress.bind(this)}>
                <Icon name="ios-add-circle-outline"/>
            </TouchableOpacity>
        );
    }


    render() {
        const {value = '', isEmoji, mode} = this.state;
        return (
            <View style={Styles.search}>
                {mode == MODE_TEXT ? this.renderTextInput() : this.renderReocrdInput()}
                <View style={{flexGrow:1, height:1, backgroundColor:"lightgray"}}/>
                {isEmoji ? this._renderEmoji() : this._renderActions()}
            </View>
        )
    }
}


