import {Container,Icon} from 'native-base';
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
import Toast from 'react-native-simple-toast';
import NIM from 'react-native-netease-im';
import InputToolbar, {MIN_INPUT_TOOLBAR_HEIGHT} from '../components/chat/InputToolbar';
import MessageContainer from '../components/chat/MessageContainer';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
const NAVIGATIONBAR_HEIGHT = 0;

export default class Chat extends React.Component {
    static navigatorStyle = {
        StatusBarColor: '#444',
        tabBarHidden: true,
        navBarBackgroundColor:"#444",
        navBarButtonColor:"#fff",
        navBarTextColor:"#fff"
    };
    constructor(props) {
        super(props);
        this.state = {
            isInitialized: false, // initialization will calculate maxHeight before rendering the chat
            recording: false,
            recordingText:"",
            recordingColor:"transparent",
            canLoadMoreContent:true,
            currentMetering:0,
            messages:[],
            showMenuBar:false,
            menuBarOrigin:{},
            menuItems:[]
        };
        this._keyboardHeight = 0;
        this._bottomOffset = 0;
        this._maxHeight = 0;
        this._touchStarted = false;
        this._isFirstLayout = true;
        this._isTypingDisabled = false;
        this._locale = 'zh-cn';
        this.recordTime = 0;

        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);
        this.onSend = this.onSend.bind(this);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
        this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);

        this.invertibleScrollViewProps = {
            inverted: true,
            keyboardShouldPersistTaps: "never",
            keyboardDismissMode:"interactive",
            onTouchStart: this.onTouchStart,
            onTouchMove: this.onTouchMove,
            onTouchEnd: this.onTouchEnd,
            onKeyboardWillShow: this.onKeyboardWillShow,
            onKeyboardWillHide: this.onKeyboardWillHide,
            onKeyboardDidShow: this.onKeyboardDidShow,
            onKeyboardDidHide: this.onKeyboardDidHide,
        };
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
    _onNavigatorEvent(event){
        const {session,navigator} = this.props;
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'setting_team') { // this is the same id field from the static navigatorButtons definition
                navigator.push({
                    screen:"ImDemo.SessionTeamDetail",
                    title:'聊天信息',
                    backButtonTitle:'返回',
                    passProps:{
                        session:session
                    }
                });
            }
            if(event.id == 'setting_user'){
                navigator.push({
                    screen:"ImDemo.SessionUserDetail",
                    title:'聊天详情',
                    passProps:{
                        session:session
                    }
                });
            }
        }
    }
    getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000);
    }
    formatData(arr){
        arr.map((m,i) => {
            if(Platform.OS === 'android' && m.attachStatus === "2"){
            if(m.imageObj && !m.imageObj.path2){
                console.log("downloading...")
                NIM.downloadAttachment(m._id);
            }
        }
        arr[i].createdAt = this.getLocalTime(m.createdAt);
    });
        arr.sort(function(a,b){return b.createdAt - a.createdAt});
        return arr;
    }

    concatMessage(newData){
        let messages = this.state.messages;
        let isHas = false;
        messages.map((res,i)=>{
            if(res._id === newData[0]._id){
            messages[i] = newData[0];
            isHas = true;
        }
    });
        if(!isHas){
            messages = newData.concat(messages);
        }
        return messages;
    }
    componentDidMount() {
        const {session={}} = this.props;
        NIM.startSession(session.contactId,session.sessionType);
        this.sessionListener = NativeAppEventEmitter.addListener("observeReceiveMessage",(data)=>{
                console.info('新消息通知',data)
        let messages = this.formatData(data);
        if (!Array.isArray(data)) {
            messages = [messages];
        }
        this.sendMessage = messages;
        messages =  messages.concat(this.state.messages);
        this.setState({
            messages:messages
        });
    });
        this.msgStatusListener = NativeAppEventEmitter.addListener("observeMsgStatus",(data)=>{
                console.info('消息状态',data)
        let newMessage = this.formatData(data);
        this.setState({
            messages:this.concatMessage(newMessage)
        });
    });
        this.audioStatusListener = NativeAppEventEmitter.addListener("observeAudioRecord",(data)=>{
                console.info('录音状态',data)
        if(data && data.playEnd && this.playingMessage){
            this.stopPlayer();
        }
        if (Platform.OS == 'ios' && data.recordPower) {
            var metering = data.recordPower;
            //ios: [-160, 0]
            metering = Math.max(metering, -160);
            metering = Math.min(metering, 0);
            //to [0, 20]
            var t = 20*(metering - (-160))/160;
            t = Math.floor(t);
            this.setState({currentMetering:t});
            this.recordTime = data.currentTime;
            console.log(t)
        }
    });
        NIM.queryMessageListEx("",20).then((data)=>{
            console.info('首次加载',data);
        this.setState({
            messages:this.formatData(data)
        });
    },(err)=>{
            console.log(err)
        });
    }
    componentWillUnmount() {
        NIM.stopSession();
        this.sessionListener && this.sessionListener.remove();
        this.msgStatusListener && this.msgStatusListener.remove();
        this.audioStatusListener && this.audioStatusListener.remove();
    }
    dispatchPlaying(id,playing){
        const {messages} = this.state;
        let newmsgs = []
        var index = messages.findIndex((m) => {
                return m._id == id;
    });
        if (index == -1) {
            return;
        } else {
            var m = Object.assign({}, messages[index], {playing:playing});
            newmsgs =  [...messages.slice(0, index), m, ...messages.slice(index+1, messages.length)];
        }
        this.setState({
            messages:newmsgs
        });

    }
    getChildContext() {
        return {
            getLocale: this.getLocale.bind(this)
        };
    }
    getLocale() {
        return this._locale;
    }
    stopPlayer(){
        NIM.stopPlay();
        this.dispatchPlaying(this.playingMessage._id,false);
        this.playingMessage = null;

    }
    setRecording(recording) {
        this.setState({recording:recording});
    }
    setRecordingText(text) {
        this.setState({recordingText:text});
    }
    setRecordingColor(color) {
        this.setState({recordingColor:color});
    }
    sendTextMessage(text) {
        NIM.sendTextMessage(text);
    }
    sendLocationImage(longitude, latitude, address) {
        NIM.sendLocationMessage(longitude,latitude,address);
    }
    onSend(text) {
        if (!text || !text.trim()) {
            return;
        }
        console.log("send text:", text);
        text = text.trim();
        this.sendTextMessage(text);
    }
    handleImagePicker() {
        ImagePicker.openPicker({
            mediaType:'photo',
            loadingLabelText:'请稍候...'
        }).then(image => {
            console.log(image)
        NIM.sendImageMessages(image.path,"myName");
    });
    }
    handleCameraPicker() {
        ImagePicker.openCamera({
            mediaType:'photo',
            loadingLabelText:'请稍候...'
        }).then(image => {
            NIM.sendImageMessages(image.path,"myName");
    });
    }
    onLocation(coordinate) {
        this.sendLocationImage(coordinate.longitude,coordinate.latitude,coordinate.address);
    }
    handleLocationClick() {
        //this.props.navigator.showModal({
        //    screen:"FeiMa.LocationPicker",
        //    title:'位置信息',
        //    backButtonTitle:'返回',
        //    passProps:{
        //        onLocation:this.onLocation.bind(this)
        //    }
        //});
        console.log("位置涉及地图等组件,比较复杂,发送方式参考onLocation()");

    }
    onMessageLongPress(origin,message) {
        console.log("on message long press:", message);
    }
    onMessagePress(message) {
        const {navigator} = this.props;
        if (message.msgType === '2' && message.audioObj) {
            //停止正在播放的消息
            if (this.playingMessage && this.playingMessage === message.id) {
                this.stopPlayer();
            }else if(this.playingMessage) {
                this.stopPlayer();
            }else{
                NIM.play(message.audioObj.path);
                this.dispatchPlaying(message._id,true);
                this.playingMessage = message;
            }
        }
        if(message.msgType === '4'){
            //navigator.push({
            //    screen:"FeiMa.LocationView",
            //    title:'查看位置',
            //    passProps:{
            //        region : message.locationObj
            //    }
            //});
        }
        if (message.msgType === '1') {
            //navigator.push({
            //    screen:"FeiMa.ImageView",
            //    passProps:{
            //        imageObj:message.imageObj
            //    }
            //});
        }
    }
    startRecording() {
        NIM.stopPlay();
        NIM.startAudioRecord();
        this.recordTime = 0;
    }
    stopRecording(canceled) {
        if (canceled) {
            NIM.cancelAudioRecord();
            return;
        }
        if(Platform.OS === "ios"){
            if(this.recordTime < 2){
                Toast.show('说话时间太短了');
                NIM.cancelAudioRecord();
                return;
            }
        }
        NIM.endAudioRecord();

    }
    setMaxHeight(height) {
        this._maxHeight = height;
    }
    getMaxHeight() {
        return this._maxHeight;
    }
    setIsFirstLayout(value) {
        this._isFirstLayout = value;
    }
    getIsFirstLayout() {
        return this._isFirstLayout;
    }
    setKeyboardHeight(height) {
        this._keyboardHeight = height;
    }
    getKeyboardHeight() {
        return this._keyboardHeight;
    }
    onKeyboardWillShow(e) {

        this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
        this.inputToolbar.actionBarHeight = 0;
        var newMessagesContainerHeight = this.getMaxHeight() - this.inputToolbar.getToolbarHeight() - this.getKeyboardHeight();
        if (e && e.duration && e.duration > 0) {
            var animation = LayoutAnimation.create(
                e.duration,
                LayoutAnimation.Types[e.easing],
                LayoutAnimation.Properties.opacity);
            LayoutAnimation.configureNext(animation);
        }
        console.log(e)
        this.setState({
            messagesContainerHeight:new Animated.Value(newMessagesContainerHeight),
            showMenuBar:false
        });
    }
    onKeyboardWillHide(e) {

        this.setKeyboardHeight(0);
        console.info(this.getMaxHeight(),this.getKeyboardHeight())
        var newMessagesContainerHeight = this.getMaxHeight() - this.inputToolbar.getToolbarHeight() - this.getKeyboardHeight();
        if (e && e.duration && e.duration > 0) {
            var animation = LayoutAnimation.create(
                e.duration,
                LayoutAnimation.Types[e.easing],
                LayoutAnimation.Properties.opacity);
            LayoutAnimation.configureNext(animation);
        }
        this.setState({
            messagesContainerHeight:new Animated.Value(newMessagesContainerHeight)
        });
    }
    onKeyboardDidShow(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillShow(e);
        }
        this.inputToolbar.dismiss();
    }
    onKeyboardDidHide(e) {
        console.info('keyboard hide',e)
        if (Platform.OS === 'android') {
            this.onKeyboardWillHide(e);
        }
    }
    scrollToBottom(animated = true) {
        this._messageContainerRef.scrollTo({
            y: 0,
            animated,
        });
    }
    onTouchStart() {
        this._touchStarted = true;
        this.inputToolbar.dismiss();
    }
    onTouchMove() {
        this._touchStarted = false;
    }

    onTouchEnd() {
        if (this._touchStarted === true && !this.state.showMenuBar) {
            Keyboard.dismiss();
            this.inputToolbar.dismiss();
        }
        this._touchStarted = false;
    }
    prepareMessagesContainerHeight(value) {
        var v = new Animated.Value(value);
        return v;
    }
    onInputToolbarHeightChange(h) {
        const newMessagesContainerHeight = this.getMaxHeight() - this.inputToolbar.getToolbarHeight() - this.getKeyboardHeight();
        if(Platform.OS === 'ios'){
            LayoutAnimation.configureNext(LayoutAnimation.create(
                100,
                LayoutAnimation.Types.keyboard,
                LayoutAnimation.Properties.scaleXY
            ));
        }else{
            LayoutAnimation.configureNext(LayoutAnimation.create(
                100,
                LayoutAnimation.Types.linear,
                LayoutAnimation.Properties.opacity
            ));
        }

        this.setState({
            messagesContainerHeight:new Animated.Value(newMessagesContainerHeight),
            showMenuBar:false
        });
    }
    _loadMoreContentAsync = async () => {
    const last = this.state.messages[this.state.messages.length-1];
    if(!last){
    return;
}
return NIM.queryMessageListEx(last._id,20).then((data)=>{
        console.info('历史记录',data)
let messages = this.formatData(data);
if (!Array.isArray(data)) {
    messages = [messages];
}
messages =  this.state.messages.concat(messages);
this.setState({
    messages:messages
});

}).then((err)=>{
    this.setState({
    canLoadMoreContent:false
});

});
}
renderMessages() {
    const {session={}} = this.props;
    return (
        <Animated.View style={{height: this.state.messagesContainerHeight }}>
<MessageContainer
    canLoadMore={this.state.canLoadMoreContent}
    onLoadMoreAsync={this._loadMoreContentAsync}
    user={{
        _id: global.imaccount, // sent messages should have same user._id
    }}
    session={session}
    invertibleScrollViewProps={this.invertibleScrollViewProps}
    onMessageLongPress={this.onMessageLongPress.bind(this)}
    onMessagePress={this.onMessagePress.bind(this)}
    messages={this.state.messages}
    ref={component => this._messageContainerRef = component}
/>
</Animated.View>
);
}
renderInputToolbar() {
    const inputToolbarProps = {
        onSend: this.onSend.bind(this),
        onHeightChange:this.onInputToolbarHeightChange.bind(this),
        giftedChat: this,

    };
    return (
        <InputToolbar
    ref={(input) => this.inputToolbar = input}
    {...inputToolbarProps}
/>
);
}
renderRecordView() {
    const {width, height} = Dimensions.get('window');
    var left = this.state.recording ? 0 : width;
    const {recordingText, recordingColor, currentMetering} = this.state;
    return (
        <Animated.View style={{position:"absolute",
        top:0,
        left:left,
        width:width,
        height:this.state.messagesContainerHeight,
        alignItems:"center",

        justifyContent:"center"}}>
<View style={{backgroundColor:"rgba(0,0,0,0.5)",
        alignItems:"center",
        borderRadius:4}}>
<Image source={require('../components/chat/Images/VoiceSearchFeedback020.png')}/>
<Text style={{margin:4,padding:4,backgroundColor:recordingColor,color:'#fff'}}>
    {recordingText}
</Text>
    </View>
    </Animated.View>);


}
render() {
    const {showMenuBar,menuBarOrigin,menuItems}=this.state
    if (this.state.isInitialized === true) {
        let onViewLayout = (e) => {
            if (this.getIsFirstLayout() === true) {
                this.setIsFirstLayout(false);
            }
        };
        return (
            <View
        style={{marginTop:NAVIGATIONBAR_HEIGHT, flex:1, backgroundColor:"#f7f7f7"}}
        onLayout={onViewLayout}>
            {this.renderMessages()}
        {this.renderRecordView()}
        {this.renderInputToolbar()}
        {showMenuBar?<MenuBar
            origin = {menuBarOrigin}
            menuItems = {menuItems}
            itemClick = {this._menuBarItemClick.bind(this)}
        />:null}
    </View>
    );
    }
    let onViewLayout = (e) => {
        const layout = e.nativeEvent.layout;
        if (layout.height == 0) {
            return;
        }
        this.setMaxHeight(layout.height);
        let t = this.prepareMessagesContainerHeight(this.getMaxHeight() - MIN_INPUT_TOOLBAR_HEIGHT);
        this.setState({
            isInitialized: true,
            messagesContainerHeight: t
        });
    };
    return (
        <View style={{marginTop:NAVIGATIONBAR_HEIGHT, flex:1, backgroundColor:"transparent"}}
    onLayout={onViewLayout} >
        </View>
);
}
}
Chat.childContextTypes = {
    getLocale: React.PropTypes.func,
};

