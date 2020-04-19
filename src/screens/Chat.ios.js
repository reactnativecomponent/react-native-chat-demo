/*
 * @会话
 * @Author: huangjun
 * @Date: 2018-10-10 16:04:34
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:05:41
 */

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
  Image,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {NimSession, NimFriend} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import IMUI from 'react-native-imui';
import {RNToasty} from 'react-native-toasty';
import Svgs from '../components/Svgs';

const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');

const AuroraIController = NativeModules.AuroraIMUIModule;
const InputView = AnimatedImplementation.createAnimatedComponent(
  IMUI.ChatInput,
);
const MessageListView = AnimatedImplementation.createAnimatedComponent(
  IMUI.MessageList,
);
const window = Dimensions.get('window');

class Chat extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {session = {}, title} = navigation.state.params;
    return {
      title,
      headerRight: () => (
        <HeaderButtons>
          <HeaderButtons.Item
            ButtonElement={
              <Image
                style={{tintColor: '#037aff'}}
                source={
                  session.sessionType === '1'
                    ? require('../images/session_team.png')
                    : require('../images/session_user.png')
                }
              />
            }
            title=""
            buttonWrapperStyle={{marginRight: 5}}
            onPress={navigation.getParam('handlerRightBtn')}
          />
        </HeaderButtons>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isInitialized: false,
      inputViewHeight: new Animated.Value(50),
      inputViewWidth: 0,
      showType: 0,
      menuViewH: 220,
      viewY: 50,
      messages: [],
    };
    this._isAutoScroll = true;
    this._isListenKeyBoard = true;
  }

  componentWillMount() {
    const {navigation} = this.props;
    const {session = {}} = navigation.state.params;

    navigation.setParams({
      handlerRightBtn: this.toSessionDetail,
    });

    NimSession.startSession(session.contactId, session.sessionType);
    NimSession.queryMessageListEx('', 20).then(
      (data) => {
        this._lastMessage = data[0];
        this.setState({
          messages: data,
        });
      },
      (err) => {
        console.log(err);
      },
    );
  }
  componentDidMount() {
    this.sessionListener = NativeAppEventEmitter.addListener(
      'observeReceiveMessage',
      (data) => {
        if (data && data.length > 0) {
          AuroraIController.appendMessages(data);
          if (this._isAutoScroll) {
            AuroraIController.scrollToBottom(true);
          }
        }
      },
    );
    this.msgStatusListener = NativeAppEventEmitter.addListener(
      'observeMsgStatus',
      (data) => {
        if (data[0].status === 'send_going') {
          // 发送中
          AuroraIController.appendMessages(data);
          AuroraIController.scrollToBottom(true);
        } else {
          AuroraIController.updateMessage(data[0]);
        }
        this._isAutoScroll = true;
      },
    );
  }
  componentWillUnmount() {
    NimSession.stopSession();
    AuroraIController.stopPlayVoice();
    this.sessionListener && this.sessionListener.remove();
    this.msgStatusListener && this.msgStatusListener.remove();
  }
  // 会话详情
  toSessionDetail = () => {
    const {navigation} = this.props;
    const {session = {}} = navigation.state.params;
    if (session.sessionType === '1') {
      navigation.push('SessionTeamDetail', {
        session,
        onResult() {
          AuroraIController.cleanAllMessages();
        },
      });
    } else {
      navigation.push('SessionUserDetail', {
        session,
        onResult() {
          AuroraIController.cleanAllMessages();
        },
      });
    }
  };
  onFeatureView = (inputHeight, showType) => {
    Animated.timing(this.state.inputViewHeight, {
      toValue: inputHeight,
      duration: 310,
    }).start();
    this.setState({
      showType,
    });
  };
  onShowKeyboard = (inputHeight, showType) => {
    if (this._isListenKeyBoard) {
      Animated.timing(this.state.inputViewHeight, {
        toValue: inputHeight,
        duration: 310,
      }).start();
      this.setState({
        showType,
      });
    }
  };
  onChangeBarHeight = (inputHeight, marginTop) => {
    Animated.timing(this.state.inputViewHeight, {
      toValue: inputHeight,
      duration: 310,
    }).start();
    this.setState({
      viewY: marginTop,
    });
  };
  onSendTextMessage = (text, IDArr) => {
    NimSession.sendTextMessage(text, IDArr);
  };
  onSendRecordMessage = (path) => {
    NimSession.sendAudioMessage(path, '0');
  };
  // @姓名
  onClickMention = () => {
    const {navigation} = this.props;
    const {session = {}} = navigation.state.params;
    if (session.sessionType === '1') {
      navigation.push('RemindList', {
        session,
        onResult: function (res) {
          AuroraIController.clickGetAtPerson(res);
        },
      });
    }
  };

  _renderActions() {
    const {session = {}} = this.props.navigation.state.params;
    return (
      <View style={styles.iconRow}>
        <View style={styles.actionCol}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={this.handleCameraPicker}>
            {Svgs.iconCamera}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>拍照</Text>
        </View>
        <View style={styles.actionCol}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={this.handleImagePicker}>
            {Svgs.iconImage}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>相册</Text>
        </View>
        <View style={[styles.actionCol]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={this.handleLocationClick}>
            {Svgs.iconLocation}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>位置</Text>
        </View>
        <View style={[styles.actionCol, {marginRight: 0}]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={this.handlePacketClick}>
            {Svgs.iconPack}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>红包</Text>
        </View>
        {session.sessionType === '0' ? (
          <View style={[styles.actionCol]}>
            <TouchableOpacity
              style={styles.iconTouch}
              onPress={this.handleTransferClick}>
              {Svgs.iconTransfer}
            </TouchableOpacity>
            <Text style={{marginTop: 6, fontSize: 12}}>转账</Text>
          </View>
        ) : null}
        <View style={[styles.actionCol]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={this.handleCustomMessageClick}>
            {Svgs.iconTransfer}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>自定义消息</Text>
        </View>
      </View>
    );
  }
  renderCustomContent() {
    if (this.state.showType === 1) {
      // 显示菜单
      return (
        <View
          style={{
            height: this.state.menuViewH,
            width: window.width,
            marginTop: this.state.viewY,
            flexGrow: 1,
            backgroundColor: 'white',
          }}>
          <View style={{height: 1, backgroundColor: '#EAEAEA'}} />
          {this._renderActions()}
        </View>
      );
    }
    return null;
  }
  onMsgClick = (message) => {
    const {navigation} = this.props;

    if (message.msgType === 'voice' && message.extend) {
      AuroraIController.tapVoiceBubbleView(message.msgId);
      if (!message.extend.isPlayed && !message.isOutgoing) {
        NimSession.updateAudioMessagePlayStatus(message.msgId);
      }
    }
    if (message.msgType === 'image' && message.extend) {
      AuroraIController.hidenFeatureView(true);
    }
    if (message.msgType === 'video' && message.extend) {
      AuroraIController.hidenFeatureView(true);
    }
    if (message.msgType === 'location' && message.extend) {
      navigation.push('LocationView', {
        region: message.extend,
      });
    }
  };
  onDealWithMenuClick = (message, strMenu) => {
    if (strMenu === '复制') {
      Clipboard.setString(message.text);
    } else if (strMenu === '删除') {
      NimSession.deleteMessage(message.msgId);
      AuroraIController.deleteMessage([message]);
    } else if (strMenu === '撤回') {
      NimSession.revokeMessage(message.msgId).then(() => {
        AuroraIController.deleteMessage([message]);
      });
    }
  };
  onStatusViewClick = (message) => {
    console.log('onStatusViewClick:', message);
  };
  onBeginDragMessageList = () => {
    AuroraIController.hidenFeatureView(true);
  };
  sendLocationImage = (longitude, latitude, address) => {
    NimSession.sendLocationMessage(longitude, latitude, address);
  };
  handleImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  handleCameraPicker = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
    // ImagePicker.openPicker({
    //     mediaType:'video',
    //     loadingLabelText:'请稍候...'
    // }).then((video) => {
    //     console.log(video);
    //     NimSession.sendVideoMessage(video.path, 'duration', 'width', 'height', 'displayName');
    // });
  };
  onLocation = (coordinate) => {
    this.sendLocationImage(
      coordinate.latitude,
      coordinate.longitude,
      coordinate.address,
    );
  };
  handleLocationClick = () => {
    this.props.navigation.push('LocationPicker', {
      onLocation: this.onLocation,
    });
  };
  handleTransferClick = () => {
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  handleCustomMessageClick = () => {
    const h5Content = `
                  <h5>This is a custom message. </h5>
                  <button type="button">Click Me!</button>
                  <h5>ok</h5>
                  `;
    NimSession.sendCustomMessage({
      Width: 260,
      Height: 120,
      pushContent: '发来一条自定义消息',
      recentContent: '[自定义消息]',
      content: h5Content,
    });
  };
  handlePacketClick = () => {
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  onMsgOpenUrlClick = (url) => {
    RNToasty.Show({
      title: `打开链接${url}`,
    });
  };

  onPacketPress = (message) => {
    console.log(message);
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  onAvatarPress = (v) => {
    if (v && v.fromUser) {
      NimFriend.getUserInfo(v.fromUser._id).then((data) => {
        this.props.navigation.push('FriendDetail', {
          friendData: data,
        });
      });
    }
  };
  onClickChangeAutoScroll = (isAutoScroll) => {
    this._isAutoScroll = isAutoScroll;
  };
  _loadMoreContentAsync = async () => {
    if (!this._lastMessage) {
      return;
    }
    NimSession.queryMessageListEx(this._lastMessage.msgId, 20).then((data) => {
      this._lastMessage = data[data.length - 1];
      AuroraIController.insertMessagesToTop(data);
      AuroraIController.stopPlayActivity();
    });
  };
  render() {
    const onViewLayout = (e) => {
      const {layout} = e.nativeEvent;
      if (layout.height === 0) {
        return;
      }
      this.setState({
        isInitialized: true,
        inputViewHeight: new Animated.Value(50),
        inputViewWidth: window.width,
      });
    };
    if (this.state.isInitialized) {
      return (
        <View style={styles.container}>
          <MessageListView
            style={[styles.messageList]}
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
            avatarSize={{width: 40, height: 40}}
            sendBubbleTextSize={18}
            sendBubbleTextColor="000000"
          />
          <InputView
            style={{
              width: this.state.inputViewWidth,
              height: this.state.inputViewHeight,
            }}
            menuViewH={this.state.menuViewH}
            defaultToolHeight={50}
            onFeatureView={this.onFeatureView}
            onShowKeyboard={this.onShowKeyboard}
            onChangeBarHeight={this.onChangeBarHeight}
            onSendTextMessage={this.onSendTextMessage}
            onSendRecordMessage={this.onSendRecordMessage}
            onClickMention={this.onClickMention}>
            {this.renderCustomContent()}
          </InputView>
          <NavigationEvents
            onWillFocus={(payload) => (this._isListenKeyBoard = true)}
            onWillBlur={(payload) => (this._isListenKeyBoard = false)}
          />
        </View>
      );
    }
    return <View style={styles.container} onLayout={onViewLayout} />;
  }
}

const {width} = Dimensions.get('window');
const sWidth = width - 55 * 4;
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
    margin: 0,
  },
  inputView: {
    backgroundColor: 'green',
    width: window.width,
    height: 100,
  },
  btnStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3e83d7',
    borderRadius: 8,
    backgroundColor: '#3e83d7',
  },
  iconRow: {
    flexDirection: 'row',
    paddingHorizontal: sWidth / 5 - 1,
    flexWrap: 'wrap',
    paddingVertical: 30,
  },
  actionCol: {
    alignItems: 'center',
    marginRight: sWidth / 5,
    height: 95,
  },
  iconTouch: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
