/**
 * Created by dowin on 2017/8/3.
 */
import {Container, Icon} from 'native-base';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    NativeAppEventEmitter,
    NativeModules,
    Alert
} from 'react-native';

import Toast from 'react-native-simple-toast';
import {Permissions, NimFriend, NimUtils, NimSession} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import {MessageList} from 'react-native-imui';
import {ChatInput} from 'react-native-imui';
import Svgs from '../components/Svgs';
const ContainerHeightMax = 800;
const ContainerHeightMin = 800;
const ChatInputHeightMax = 300;
const ChatInputHeightMin = 56;
const ChatInputHeightBg = '#ffffff';
const AuroraIMUIModule = NativeModules.AuroraIMUIModule;
class Chat extends React.Component {
    static navigatorStyle = {

        tabBarHidden: true,
        navBarBackgroundColor:'#fc513a',
        navBarButtonColor: "#fff",
        navBarTextColor: "#fff"
    };

    constructor(props) {
        super(props);
        this.state = {
            isInitialized: false, // initialization will calculate maxHeight before rendering the chat
            canLoadMoreContent: true,
            currentMetering: 0,
            messages: [],
            lastMessage: undefined,
            showMenuBar: false,
            menuBarOrigin: {},
            menuItems: [],
            isPacketModalOpen: false,
            packetData: {},
            sendUser: {},
            selectMessage: {},
            menuContainerHeight: ContainerHeightMax,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMin
            },
            level: '', time: '', status: '',
            isDismissMenuContainer: false,
            initList: [],
        };
        this._locale = 'zh-cn';
        this._newMesages = [];
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);
        this.onSend = this.onSend.bind(this);

        if (props.session && props.session.sessionType === '1') {
            this.props.navigator.setButtons({
                rightButtons: [{
                    id: 'setting_team',
                    icon: require('../images/session_team.png')
                }]
            });
        } else {
            this.props.navigator.setButtons({
                rightButtons: [{
                    id: 'setting_user',
                    icon: require('../images/session_user.png')
                }]
            });
        }
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }

    _onNavigatorEvent(event) {
        const {session, navigator} = this.props;
        let self = this;
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'setting_team') { // this is the same id field from the static navigatorButtons definition
                navigator.push({
                    screen: "ImDemo.SessionTeamDetail",
                    title: '聊天信息',
                    backButtonTitle: '返回',
                    passProps: {
                        session: session,
                        onResult: function () {
                            self.setState({
                                messages: []
                            });
                        }
                    }
                });
            }
            if (event.id === 'setting_user') {
                navigator.push({
                    screen: "ImDemo.SessionUserDetail",
                    title: '聊天详情',
                    passProps: {
                        session: session,
                        onResult: function () {
                            self.setState({
                                messages: []
                            });
                        }
                    }
                });
            }
        }
    }
    componentDidMount() {
        const {session = {}} = this.props;
        NimSession.startSession(session.contactId, session.sessionType);
        this.sessionListener = NativeAppEventEmitter.addListener("observeReceiveMessage", (data) => {
            console.info('新消息通知', data);
            if (data && data.length > 0) {
                AuroraIMUIModule.appendMessages(data);
            }

        });
        this.msgStatusListener = NativeAppEventEmitter.addListener("observeMsgStatus", (data) => {
            console.info('消息', data);
            if (data.length > 0) {
                if (data[0].status === '0') {
                    AuroraIMUIModule.appendMessages(data);
                } else {
                    for (var i in data) {
                        AuroraIMUIModule.updateMessage(data[i]);
                    }
                }
            }

        });
        this.deleteMessageListener = NativeAppEventEmitter.addListener("observeDeleteMessage", (data) => {
            if (data.length > 0) {
                for (var i in data) {
                    AuroraIMUIModule.deleteMessage(data[i]);
                }
            }
        });

        NimSession.queryMessageListEx("", 20).then((data) => {
            console.info('首次加载', data);
            if (data.length > 0) {
                this.setState({lastMessage: data[0]});
                // AuroraIMUIModule.appendMessages(data);
                this.setState({initList:data});
            }

        }, (err) => {
            console.log(err)
        });
    }

    componentWillUnmount() {
        NimSession.stopSession();
        this.sessionListener && this.sessionListener.remove();
        this.msgStatusListener && this.msgStatusListener.remove();
        this.deleteMessageListener && this.deleteMessageListener.remove();
    }

    sendLocationImage(longitude, latitude, address) {
        NimSession.sendLocationMessage(longitude, latitude, address);
    }
    onSend(text, ids) {
        if (!text || !text.trim()) {
            Toast.show('请输入聊天内容');
            return;
        }
        text = text.trim();
        NimSession.sendTextMessage(text, ids);
        AuroraIMUIModule.scrollToBottom();
        this.forceUpdate();

    }
    onSendVoice = (path, duration) => {
        NimSession.sendAudioMessage(path, duration);
    }
    handleImagePicker() {
        if(!this.state.action){
            return
        }
        Permissions.check('photo').then(res => {
            if (res === 'authorized') {
                ImagePicker.openPicker({
                    mediaType: 'photo',
                    loadingLabelText: '请稍候...'
                }).then(image => {
                    NimSession.sendImageMessages(image.path, "myName");
                });
            } else {
                Alert.alert(
                    '',
                    '请到设置中心开启相册权限',
                    [{text: '确定'}]
                );
            }
        });
    }

    handleCameraPicker() {
        if(!this.state.action){
            return
        }
        Permissions.check('camera').then(res => {
            if (res === 'authorized') {
                ImagePicker.openCamera({
                    mediaType: 'photo',
                    loadingLabelText: '请稍候...'
                }).then(image => {
                    NimSession.sendImageMessages(image.path, "myName");
                });
            } else {
                Alert.alert(
                    '',
                    '请到设置中心开启摄像机权限',
                    [{text: '确定'}]
                );
            }
        });
    }

    onLocation(coordinate) {
        this.sendLocationImage(coordinate.longitude, coordinate.latitude, coordinate.address);
    }

    handleLocationClick() {
        this.props.navigator.showModal({
            screen: "ImDemo.LocationPicker",
            title: '位置信息',
            backButtonTitle: '返回',
            passProps: {
                onLocation: this.onLocation.bind(this)
            }
        });
    }

    handleTransferClick() {
        if(!this.state.action){
            return
        }
        const {navigator, session} = this.props;

    }

    handlePacketClick() {
        if(!this.state.action){
            return
        }
        const {session} = this.props;
    }

    onPullToRefresh() {
        this._loadMoreContentAsync();
    }

    onMessageLongPress(origin, message) {

    }
    onOpenURL(url) {
        this.props.navigator.push({
            screen: "FeiMa.LinkView",
            passProps: {
                url: config.domain + "/web/redirect?url=" + url
            }
        });
    }

    onLinkClick(message) {
        console.log("onLinkClick:", message);
    }
    onMessagePress(message) {
        NimSession.revokeMessage(message.msgId)
        const {navigator, actions, session} = this.props;
        if (message.msgType === '2' && message.audioObj) {
            //停止正在播放的消息
            if (this.playingMessage && this.playingMessage === message.id) {
                this.stopPlayer();
            } else if (this.playingMessage) {
                this.stopPlayer();
            } else {
                NimUtils.play(message.audioObj.path);
                this.dispatchPlaying(message._id, true);
                this.playingMessage = message;
            }
        }
        if (message.msgType === '4') {
            navigator.push({
                screen: "FeiMa.LocationView",
                title: '查看位置',
                passProps: {
                    region: message.locationObj
                }
            });
        }
        if (message.msgType === '1') {
            navigator.push({
                screen: "FeiMa.ImageView",
                passProps: {
                    imageObj: message.imageObj
                }
            });
        }
        if (message.msgType === '100') {
            if (message.custType === "redpacket" && message.redPacketObj) {
                actions.grabRedPacket(message.redPacketObj.serialNo, (res) => {
                    if (res.msg === "REDPACKET_OPEN_DETAIL") {
                        navigator.push({
                            screen: "FeiMa.PacketDetail",
                            title: '红包详情',
                            passProps: {
                                redPacketObj: message.redPacketObj,
                                packDetail: res.obj
                            }
                        });
                    } else {
                        if (Platform.OS === 'android') {
                            navigator.showLightBox({
                                screen: "FeiMa.OpenPacket",
                                passProps: {
                                    data: res,
                                    session: session,
                                    onResult: function (res, toDetail) {
                                        if (res.msg === "REDPACKET_OPEN_DETAIL" || toDetail) {
                                            navigator.push({
                                                screen: "FeiMa.PacketDetail",
                                                title: '红包详情',
                                                passProps: {
                                                    packDetail: res.obj
                                                }
                                            });
                                        }
                                    }
                                },
                                style: {
                                    backgroundBlur: "none",
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    tapBackgroundToDismiss: true
                                }
                            });
                        } else {
                            this.setState({
                                isPacketModalOpen: true,
                                packetData: res,
                                sendUser: message.user
                            });
                        }
                    }
                });

            } else if (message.custType === "transfer" && message.bankTransferObj) {
                actions.transferDetail(message.bankTransferObj.serialNo, (res) => {
                    navigator.push({
                        screen: "FeiMa.TransferDetail",
                        title: '账单详情',
                        passProps: {
                            data: res
                        }
                    });
                })

            }
        }
    }
    onTouchMsgList = () => {
        this.setState({
            isDismissMenuContainer: true,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMin
            },
        });
    }

    onAvatarPress(v) {
        if (v && v.user) {
            NimFriend.getUserInfo(v.user._id).then((data) => {
                this.props.navigator.push({
                    screen: 'FeiMa.FriendDetail',
                    title: '详细资料',
                    backButtonTitle: '返回',
                    passProps: {
                        friendData: data
                    }
                });
            })
        }

    }
    _loadMoreContentAsync = async() => {
        const last = this.state.lastMessage;
        if (!last) {
            return;
        }
        return NimSession.queryMessageListEx(last._id, 20).then((data) => {
            console.info('历史记录', data);
            if (data.length > 0) {

                this.setState({lastMessage: data[data.length - 1]});
                AuroraIMUIModule.insertMessagesToTop(data);
            }
        }, (err) => {
            this.setState({
                canLoadMoreContent: false
            });
            console.info('加载错误', err);
        });
    }
    onTouchMsgList = () => {
        this.setState({
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMin
            },
        });
    }
    onSendText = (text) => {
        this.onSend(text, [])
        this.forceUpdate();
    }

    onStartRecordVoice = () => {
        console.info("onStartRecordVoice");
        this.setState({recordStatus: 1});
    }

    onFinishRecordVoice = (path, duration) => {
        this.setState({recordStatus: ""})
        NimSession.sendAudioMessage(path, duration);
        console.info("onFinishRecordVoice ", path, duration);
    }
    onCancelRecordVoice = (e) => {
        this.setState({recordStatus: ""})
        console.log("onCancelRecordVoice");

    }
    onSwitchToMicrophoneMode = async() => {
        this.setState({
            isDismissMenuContainer: true,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMin
            },
            menuContainerHeight: ContainerHeightMin,
        });
        AuroraIMUIModule.scrollToBottom();
    }


    onSwitchToActionMode = async() => {
        this.setState({
            action:true,
            isDismissMenuContainer: false,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMax
            },
            menuContainerHeight: ContainerHeightMax,
        });
        AuroraIMUIModule.scrollToBottom();
    }

    onSwitchToEmojiMode = async() => {
        this.setState({
            action:false,
            isDismissMenuContainer: false,
            chatInputStyle: {
                backgroundColor: ChatInputHeightBg,
                width: width,
                height: ChatInputHeightMax
            },
            menuContainerHeight: ContainerHeightMax-1,
        });
        AuroraIMUIModule.scrollToBottom();
    }

    onEditTextChange = (text) => {
        // console.log("text:",text);
    }
    onTouchEditText = () => {
        this.setState({
            isDismissMenuContainer: true,
            chatInputStyle: {
                width: width,
                height: ChatInputHeightMin
            },
            menuContainerHeight: ContainerHeightMin,
        });
        AuroraIMUIModule.scrollToBottom();
    }
    renderChatInput() {
        return (<ChatInput
            style={this.state.chatInputStyle}
            menuContainerHeight={this.state.menuContainerHeight}
            isDismissMenuContainer={this.state.isDismissMenuContainer}
            onSendText={this.onSendText}
            onSendVoice={this.onSendVoice}
            onSwitchToMicrophoneMode={this.onSwitchToMicrophoneMode}
            onSwitchToActionMode={this.onSwitchToActionMode}
            onSwitchToEmojiMode={this.onSwitchToEmojiMode}
            onTouchEditText={this.onTouchEditText}
            onEditTextChange={this.onEditTextChange}>
            <View style={styles.search}>
                <View style={{flexGrow:1, height:1, backgroundColor:"lightgray"}}/>
                {this.renderActionBar()}
            </View>
        </ChatInput>);
    }
    renderMessages() {
        return (
            <MessageList
                style={{flex: 1,marginTop:15,marginBottom:15}}
                onMsgClick={this.onMessagePress.bind(this)}
                onMsgLongClick={this.onMessageLongPress.bind(this)}
                onLinkClick={this.onLinkClick.bind(this)}
                onAvatarClick={()=>{}}
                onStatusViewClick={()=>{}}
                onTouchMsgList={this.onTouchMsgList}
                onPullToRefresh={this.onPullToRefresh.bind(this)}
                sendBubble={{imageName: "send_msg", padding: 10}}
                receiveBubbleTextColor={'#ffffff'}
                sendBubbleTextSize={14}
                receiveBubbleTextSize={14}
                sendBubblePressedColor={'#dddddd'}
                eventMsgTxtColor={'#ffffff'}
                eventMsgTxtSize={12}
                initList={this.state.initList}
            />
        );
    }
    renderActionBar() {
        const {session} = this.props;
        return (
            <View style={styles.iconRow}>
                <View style={styles.actionCol}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleCameraPicker.bind(this)}>
                        {Svgs.iconCamera}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>拍照</Text>
                </View>
                <View style={styles.actionCol}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleImagePicker.bind(this)}>
                        {Svgs.iconImage}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>相册</Text>
                </View>
                <View style={[styles.actionCol]}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleLocationClick.bind(this)}>
                        {Svgs.iconLocation}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>位置</Text>
                </View>
                <View style={[styles.actionCol,{marginRight:0}]}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handlePacketClick.bind(this)}>
                        {Svgs.iconPack}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>红包</Text>
                </View>
                {session.sessionType === '0' ? <View style={[styles.actionCol]}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleTransferClick.bind(this)}>
                        {Svgs.iconTransfer}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>转账</Text>
                </View> : null}
            </View>
        );
    }

    render() {

        return (
            <View style={{ flex:1, backgroundColor:"#f7f7f7"}}>
                {this.renderMessages()}
                {this.renderChatInput()}
            </View>
        );
    }
}

const {width, height} = Dimensions.get('window');
const sWidth = width-55*4;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    messageList: {
        // backgroundColor: 'red',
        flex: 1,
        marginTop: 0,
        width: window.width,
        margin:0,
    },
    inputView: {
        backgroundColor: 'green',
        width: window.width,
        height:100,

    },
    btnStyle: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7'
    },
    iconRow: {
        flexDirection: 'row',
        paddingHorizontal:sWidth/5-1,
        flexWrap:'wrap',
        paddingVertical:30,
        flex:1
    },
    actionCol:{
        alignItems:"center",
        marginRight:sWidth/5,
        height:95
    },
    iconTouch: {
        justifyContent:'center',
        alignItems:'center',
    },
    search: {
        //marginTop: 5,
        flexDirection: 'column',
        //paddingTop: 10,
        backgroundColor: "#fff",
    },
});

export  default Chat;
