/**
 * Created by Dowin on 17/3/21.
 */
import {Container,Icon} from 'native-base';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Clipboard,
    NativeAppEventEmitter,
    NativeModules,

} from 'react-native';
import {NimSession,NimFriend,NimUtils} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import Svgs from '../components/Svgs';
const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');
const AuroraIController = NativeModules.AuroraIMUIModule;
import IMUI from 'react-native-imui'
import Toast from 'react-native-simple-toast';
const InputView = AnimatedImplementation.createAnimatedComponent(IMUI.ChatInput);
const MessageListView = AnimatedImplementation.createAnimatedComponent(IMUI.MessageList)
const window = Dimensions.get('window');

class Chat extends React.Component {
    static navigatorStyle = {
        tabBarHidden: true,
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    constructor(props) {
        super(props);
        this.state = {
            isInitialized:false,
            inputViewHeight: new Animated.Value(50),
            inputViewWidth: 0,
            showType: 0,
            menuViewH:220,
            viewY:50,
            messages:[]
        };
        this._isAutoScroll = true;
        this._isListenKeyBoard = true;
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);

        if(props.session && props.session.sessionType === '1'){
            this.props.navigator.setButtons({
                rightButtons:[{
                    id:'setting_team',
                    icon:require('../images/session_team.png')
                }]
            });
        }else{
            this.props.navigator.setButtons({
                rightButtons:[{
                    id:'setting_user',
                    icon:require('../images/session_user.png')
                }]
            });
        }
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        const {session} = this.props;
        NimSession.startSession(session.contactId,session.sessionType);
        NimSession.queryMessageListEx("",20).then((data)=>{
            this._lastMessage = data[data.length-1];
            this.setState({
                messages:data
            })
        },(err)=>{
            console.log(err)
        });
    }
    _onNavigatorEvent(event){
        const {session,navigator} = this.props;
        if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id === 'setting_team') { // this is the same id field from the static navigatorButtons definition
                navigator.push({
                    screen:"ImDemo.SessionTeamDetail",
                    title:'聊天信息',
                    backButtonTitle:'返回',
                    passProps:{
                        session:session,
                        onResult:function(){
                            AuroraIController.cleanAllMessages();
                        }
                    }
                });
            }
            if(event.id === 'setting_user'){
                navigator.push({
                    screen:"ImDemo.SessionUserDetail",
                    title:'聊天详情',
                    passProps:{
                        session:session,
                        onResult:function(){
                            AuroraIController.cleanAllMessages();
                        }
                    }
                });
            }
        }
        if(event.id === 'willAppear'){
            this._isListenKeyBoard = true;

        }
        if(event.id === 'didAppear'){
            AuroraIController.clickLoadEmotionPages();
        }
        if(event.id === 'willDisappear'){
            this._isListenKeyBoard = false;
        }
    }
    componentDidMount() {
        this.sessionListener = NativeAppEventEmitter.addListener("observeReceiveMessage",(data)=>{
            if(data && data.length > 0){
                AuroraIController.appendMessages(data);
                if(this._isAutoScroll)
                    AuroraIController.scrollToBottom(true)

            }
        });
        this.msgStatusListener = NativeAppEventEmitter.addListener("observeMsgStatus",(data)=>{
            console.log(data)
            if(data[0].status === 'send_going'){//发送中
                AuroraIController.appendMessages(data)
                AuroraIController.scrollToBottom(true)
            }else {
                AuroraIController.updateMessage(data[0])
            }
            this._isAutoScroll = true;
        });
    }
    componentWillUnmount() {
        NimSession.stopSession();
        AuroraIController.stopPlayVoice();
        this.sessionListener && this.sessionListener.remove();
        this.msgStatusListener && this.msgStatusListener.remove();
    }

    onFeatureView = (inputHeight,showType) => {
        Animated.timing(this.state.inputViewHeight,{
            toValue:inputHeight,
            duration:310
        }).start();
        this.setState({
            showType: showType,
        })
    }
    onShowKeyboard = (inputHeight,showType) => {
        if(this._isListenKeyBoard){
            Animated.timing(this.state.inputViewHeight,{
                toValue:inputHeight,
                duration:310
            }).start();
            this.setState({
                showType: showType,
            })
        }
    }
    onChangeBarHeight = (inputHeight,marginTop) => {
        Animated.timing(this.state.inputViewHeight,{
            toValue:inputHeight,
            duration:310
        }).start();
        this.setState({
            viewY: marginTop,
        })
    }
    onSendTextMessage = (text,IDArr) =>{
        NimSession.sendTextMessage(text,IDArr);
    }
    onSendRecordMessage = (path) =>{
        NimSession.sendAudioMessage(path,'0');
    }
    onClickMention = ()=>{
        const {session} = this.props;
        if (session.sessionType === '1'){
            // this.props.navigator.showModal({
            //     screen:'FeiMa.RemindList',
            //     title:'选择提醒的人',
            //     passProps:{
            //         session:this.props.session,
            //         onResult:function(res){
            //
            //             AuroraIController.clickGetAtPerson(res)
            //         }
            //     }
            // });
        }
    }

    _renderActions() {
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
                    <Text style={{marginTop:6, fontSize:12}} >相册</Text>
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
                <View style={[styles.actionCol]}>
                    <TouchableOpacity style={styles.iconTouch} onPress={this.handleCustomMessageClick.bind(this)}>
                        {Svgs.iconTransfer}
                    </TouchableOpacity>
                    <Text style={{marginTop:6, fontSize:12}}>自定义消息</Text>
                </View>
            </View>
        );
    }

    renderCustomContent(){
        if(this.state.showType === 0){//不显示
            return null;
        }else if(this.state.showType === 1){//显示菜单
            return (
                <View style={{height:this.state.menuViewH,width:window.width,
                    marginTop:this.state.viewY,flexGrow:1,backgroundColor:"white"}}>
                    <View style={{ height:1, backgroundColor:"#EAEAEA"}}/>
                    {this._renderActions()}
                </View>
            );
        }
    }
    onMsgClick = (message) => {
        const {navigator} = this.props;

        if (message.msgType === 'voice'  &&  message.extend){
            AuroraIController.tapVoiceBubbleView(message.msgId)
            if (!message.extend.isPlayed  &&  message.isOutgoing == false ){
                NimSession.updateAudioMessagePlayStatus(message.msgId);
            }
        }
        if (message.msgType === 'image' && message.extend) {
            AuroraIController.hidenFeatureView(true)
        }
        if (message.msgType === 'video' && message.extend) {
            AuroraIController.hidenFeatureView(true)
        }
        if(message.msgType === 'location'  && message.extend){
            navigator.push({
                screen:"ImDemo.LocationView",
                title:'查看位置',
                passProps:{
                    region : message.extend
                }
            });
        }

    }
    onDealWithMenuClick = (message,strMenu) => {
        if (strMenu === '复制'){
            Clipboard.setString(message.text);
        }else if(strMenu === '删除'){
            NimSession.deleteMessage(message.msgId);
            AuroraIController.deleteMessage([message])
        }else  if(strMenu === '撤回'){
            NimSession.revokeMessage(message.msgId).then((data)=>{
                AuroraIController.deleteMessage([message])
            });
        }
    }
    onStatusViewClick = (message) => {
        console.log('onStatusViewClick:',message)
    }
    onBeginDragMessageList = () => {
        AuroraIController.hidenFeatureView(true)
    }
    sendLocationImage(longitude, latitude, address) {
        NimSession.sendLocationMessage(longitude,latitude,address);
    }
    handleImagePicker() {
        ImagePicker.openPicker({
            mediaType:'photo',
            loadingLabelText:'请稍候...'
        }).then(image => {
            NimSession.sendImageMessages(image.path,"myName");
        });
    }
    handleCameraPicker() {
        ImagePicker.openCamera({
            mediaType:'photo',
            loadingLabelText:'请稍候...'
        }).then(image => {
            NimSession.sendImageMessages(image.path,"myName");
        });
        // ImagePicker.openPicker({
        //     mediaType:'video',
        //     loadingLabelText:'请稍候...'
        // }).then((video) => {
        //     console.log(video);
        //     NimSession.sendVideoMessage(video.path, 'duration', 'width', 'height', 'displayName');
        // });
    }
    onLocation(coordinate) {
        this.sendLocationImage(coordinate.latitude,coordinate.longitude,coordinate.address);
    }
    handleLocationClick() {
        this.props.navigator.showModal({
            screen:"ImDemo.LocationPicker",
            title:'位置信息',
            backButtonTitle:'返回',
            passProps:{
                onLocation:this.onLocation.bind(this)
            }
        });
    }
    handleTransferClick(){
        const {navigator,session} = this.props;
        Toast.show('需要自行实现');
    }
    handleCustomMessageClick(){
        const {navigator,session} = this.props;
        var h5Content = `
                  <h5>This is a custom message. </h5>
                  <button type="button">Click Me!</button>
                  <h5>ok</h5>
                  `
        NimSession.sendCustomMessage({Width:260,Height:120,pushContent:'发来一条自定义消息',recentContent:'[自定义消息]',content:h5Content});
    }
    handlePacketClick(){
        const {session} = this.props;
        Toast.show('需要自行实现');
    }
    onMsgOpenUrlClick=(url)=>{
        Toast.show('打开链接');
    }

    onPacketPress(message){
        const {navigator} = this.props;
        Toast.show('需要自行实现');
    }
    onAvatarPress = (v) =>{
        if(v && v.fromUser){
            NimFriend.getUserInfo(v.fromUser._id).then((data)=>{
                this.props.navigator.push({
                    screen:'ImDemo.FriendDetail',
                    title:'详细资料',
                    backButtonTitle:'返回',
                    passProps:{
                        friendData:data
                    }
                });
            })
        }
    }
    onClickChangeAutoScroll=(isAutoScroll)=>{
        this._isAutoScroll = isAutoScroll;
    }
    _loadMoreContentAsync = async () => {
        if(!this._lastMessage){
            return;
        }
        return NimSession.queryMessageListEx(this._lastMessage.msgId,20).then((data)=>{
            this._lastMessage = data[data.length-1];
            AuroraIController.insertMessagesToTop(data);
            AuroraIController.stopPlayActivity()
        },(err)=>{
            AuroraIController.stopPlayActivity()
        });
    }
    render() {
        let onViewLayout = (e) => {
            const layout = e.nativeEvent.layout;
            if (layout.height === 0) {
                return;
            }
            this.setState({
                isInitialized: true,
                inputViewHeight:new Animated.Value(50),
                inputViewWidth:window.width,
            });
        };
        if(this.state.isInitialized){
            return (
                <View style={styles.container}>
                    <MessageListView style={[styles.messageList]}
                                     initalData={this.state.messages}
                                     onAvatarClick={this.onAvatarPress}
                                     onMsgClick={this.onMsgClick}
                                     onMsgOpenUrlClick={this.onMsgOpenUrlClick}
                                     onDealWithMenuClick={this.onDealWithMenuClick}
                                     onStatusViewClick={this.onStatusViewClick}
                                     onTapMessageCell={this.onTapMessageCell}
                                     onClickChangeAutoScroll={this.onClickChangeAutoScroll}
                                     onBeginDragMessageList={this.onBeginDragMessageList}
                                     onClickLoadMessages={this._loadMoreContentAsync}
                                     avatarSize={{width:40,height:40}}
                                     sendBubbleTextSize={18}
                                     sendBubbleTextColor={"000000"}

                    />
                    <InputView style={{width:this.state.inputViewWidth,height:this.state.inputViewHeight}} menuViewH={this.state.menuViewH}
                               defaultToolHeight={50}
                               onFeatureView={this.onFeatureView}
                               onShowKeyboard={this.onShowKeyboard}
                               onChangeBarHeight = {this.onChangeBarHeight}
                               onSendTextMessage = {this.onSendTextMessage}
                               onSendRecordMessage = {this.onSendRecordMessage}
                               onClickMention = {this.onClickMention}
                    >
                        {this.renderCustomContent()}
                    </InputView>
                </View>
            );
        }
        return (
            <View style={styles.container} onLayout={onViewLayout} >
            </View>
        )

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
        paddingVertical:30
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
});


export default Chat;
