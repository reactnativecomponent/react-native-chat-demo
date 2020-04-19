/*
 * @会话
 * @Author: huangjun
 * @Date: 2018-10-10 15:49:57
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:28:50
 */
import React from 'react';
import {
  Clipboard,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  NativeAppEventEmitter,
  NativeModules,
  Image,
  Animated,
} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {NimFriend, NimSession} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import {MessageList, ChatInput} from 'react-native-imui';
import Svgs from '../components/Svgs';

const ContainerHeightMax = 800;

const ChatInputHeightBg = '#ffffff';
const {AuroraIMUIModule} = NativeModules;
const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');

const MessageListView = AnimatedImplementation.createAnimatedComponent(
  MessageList,
);
const InputView = AnimatedImplementation.createAnimatedComponent(ChatInput);
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
      menuContainerHeight: ContainerHeightMax,
      chatInputStyle: {
        backgroundColor: ChatInputHeightBg,
        width,
      },
      chatInputheight: new Animated.Value(48),
      isDismissMenuContainer: false,
      initList: [],
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    const {session = {}} = navigation.state.params;

    navigation.setParams({
      handlerRightBtn: this.toSessionDetail,
    });
    NimSession.startSession(session.contactId, session.sessionType);
    this.sessionListener = NativeAppEventEmitter.addListener(
      'observeReceiveMessage',
      (data) => {
        console.info('新消息通知', data);
        console.warn(JSON.stringify(data));
        if (data && data.length > 0) {
          AuroraIMUIModule.appendMessages(data);
          AuroraIMUIModule.scrollToBottom();
        }
      },
    );
    this.msgStatusListener = NativeAppEventEmitter.addListener(
      'observeMsgStatus',
      (data) => {
        console.info('消息', data);
        console.info('新消息通知', data);
        if (data.length > 0) {
          if (data[0].status === 'send_sending') {
            AuroraIMUIModule.appendMessages(data);
          } else {
            data.map((d) => {
              AuroraIMUIModule.updateMessage(d);
            });
          }
          AuroraIMUIModule.scrollToBottom();
        }
      },
    );
    // 删除消息通知
    this.deleteMessageListener = NativeAppEventEmitter.addListener(
      'observeDeleteMessage',
      (data) => {
        if (data.length > 0) {
          data.map((d) => {
            AuroraIMUIModule.deleteMessage(d);
          });
        }
      },
    );

    NimSession.queryMessageListEx('', 20).then(
      (data) => {
        console.info('首次加载', data);
        if (data.length > 0) {
          const [first] = data;
          this._lastMessage = first;
          this.setState({initList: data});
          AuroraIMUIModule.scrollToBottom();
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }
  componentWillUnmount() {
    NimSession.stopSession();
    this.sessionListener && this.sessionListener.remove();
    this.msgStatusListener && this.msgStatusListener.remove();
    this.deleteMessageListener && this.deleteMessageListener.remove();
  }
  // 会话详情
  toSessionDetail = () => {
    const {navigation} = this.props;
    const {session} = navigation.state.params;
    if (session.sessionType === '1') {
      navigation.push('SessionTeamDetail', {
        session,
        onResult() {
          AuroraIMUIModule.clearMessage();
        },
      });
    } else {
      navigation.push('SessionUserDetail', {
        session,
        onResult() {
          AuroraIMUIModule.clearMessage();
        },
      });
    }
  };

  sendLocationImage = (longitude, latitude, address) => {
    NimSession.sendLocationMessage(longitude, latitude, address);
  };
  onSend = (text, ids) => {
    let t = text;
    if (!t || !t.trim()) {
      RNToasty.Show({
        title: '请输入聊天内容',
      });
      return;
    }
    t = text.trim();
    NimSession.sendTextMessage(t, ids);

    this.forceUpdate();
  };
  handleImagePicker = () => {
    if (!this.state.action) {
      return;
    }
    ImagePicker.openPicker({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  handleCameraPicker = () => {
    if (!this.state.action) {
      return;
    }
    ImagePicker.openCamera({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  onLocation = (coordinate) => {
    this.sendLocationImage(
      coordinate.longitude,
      coordinate.latitude,
      coordinate.address,
    );
  };
  handleLocationClick = () => {
    if (!this.state.action) {
      return;
    }
    this.props.navigation.push('LocationPicker', {
      onLocation: this.onLocation,
    });
  };
  handleTransferClick = () => {
    if (!this.state.action) {
      return;
    }
    RNToasty.Show({
      title: '向好友转账',
    });
  };
  handlePacketClick = () => {
    if (!this.state.action) {
      return;
    }
    RNToasty.Show({
      title: '发红包',
    });
  };
  onOpenURL = (url) => {
    RNToasty.Show({
      title: `打开链接${url}`,
    });
  };
  onMessagePress = (message) => {
    const {navigator} = this.props;
    if (message.msgType === 'location') {
      navigator.push({
        screen: 'ImDemo.LocationView',
        title: '查看位置',
        passProps: {
          region: message.extend,
        },
      });
    }
    if (message.msgType === 'redpacket' && message.extend) {
      RNToasty.Show({
        title: '红包详情',
      });
    }
    if (message.msgType === 'transfer' && message.extend) {
      RNToasty.Show({
        title: '转账详情',
      });
    }
    if (message.msgType === 'redpacketOpen' && message.extend) {
      this.onPacketPress(message);
    }
  };
  onTouchMsgList = () => {
    Animated.timing(this.state.chatInputheight, {
      toValue: 48,
      duration: 200,
    }).start();
    this.setState({
      isDismissMenuContainer: true,
      chatInputStyle: {
        backgroundColor: ChatInputHeightBg,
        width,
      },
    });
  };
  onPacketPress = (message) => {
    console.log(message);
    RNToasty.Show({
      title: '红包详情',
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
  _loadMoreContentAsync = () => {
    if (!this._lastMessage) {
      return;
    }
    NimSession.queryMessageListEx(this._lastMessage.msgId, 20).then((data) => {
      if (data.length > 0) {
        const [first] = data;
        this._lastMessage = first;
        AuroraIMUIModule.insertMessagesToTop(data);
      }
    });
  };
  onSendText = (text) => {
    this.onSend(text, []);
  };
  onSendRecordMessage = (path, duration) => {
    NimSession.sendAudioMessage(path, duration);
  };
  onFeatureView = (inputHeight, showType) => {
    if (showType > 0) {
      Animated.timing(this.state.chatInputheight, {
        toValue: 323,
        duration: 200,
      }).start();
    } else {
      Animated.timing(this.state.chatInputheight, {
        toValue: 48,
        duration: 260,
      }).start();
    }
    this.setState({
      action: showType === 2,
      isDismissMenuContainer: false,
      chatInputStyle: {
        backgroundColor: ChatInputHeightBg,
        width,
        // height: showType === 0 ? ChatInputHeightMin : ChatInputHeightMax
      },
      // showType === 0 ? ContainerHeightMin : ContainerHeightMax + showType,
      menuContainerHeight: ContainerHeightMax,
    });
    setTimeout(() => {
      AuroraIMUIModule.scrollToBottom();
    }, 500);
  };
  onShowKeyboard = () => {
    setTimeout(() => {
      AuroraIMUIModule.scrollToBottom();
    }, 200);
  };
  onEditTextChange = (text) => {
    console.log('用于做@提醒:', text);
  };
  onStatusViewClick = (message, opt) => {
    console.info('onStatusViewClick', `${message}--${opt}`);
    if (opt === 'copy') {
      Clipboard.setString(message.text);
    } else if (opt === 'delete') {
      NimSession.deleteMessage(message.msgId);
      AuroraIMUIModule.deleteMessage([message]);
    } else if (opt === 'revoke') {
      NimSession.revokeMessage(message.msgId).then(() => {
        AuroraIMUIModule.deleteMessage([message]);
      });
    }
  };
  renderChatInput() {
    return (
      <InputView
        style={[
          this.state.chatInputStyle,
          {height: this.state.chatInputheight},
        ]}
        menuContainerHeight={this.state.menuContainerHeight}
        isDismissMenuContainer={this.state.isDismissMenuContainer}
        onSendText={this.onSendText}
        onSendVoice={this.onSendRecordMessage}
        onShowKeyboard={this.onShowKeyboard}
        onFeatureView={this.onFeatureView}
        onEditTextChange={this.onEditTextChange}>
        <View style={styles.search}>{this.renderActionBar()}</View>
      </InputView>
    );
  }
  renderMessages() {
    return (
      <MessageListView
        style={{flex: 1}}
        onMsgClick={this.onMessagePress}
        onLinkClick={this.onOpenURL}
        onAvatarClick={this.onAvatarPress}
        onStatusViewClick={this.onStatusViewClick}
        onTouchMsgList={this.onTouchMsgList}
        onClickChangeAutoScroll={this.onClickChangeAutoScroll}
        onPullToRefresh={this._loadMoreContentAsync}
        sendBubble={{imageName: 'send_msg', padding: 10}}
        receiveBubbleTextColor="#ffffff"
        sendBubbleTextSize={14}
        receiveBubbleTextSize={14}
        sendBubblePressedColor="#dddddd"
        eventMsgTxtColor="#ffffff"
        eventMsgTxtSize={12}
        initList={this.state.initList}
      />
    );
  }
  renderActionBar() {
    const {session} = this.props.navigation.state.params;
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
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        {this.renderMessages()}
        {this.renderChatInput()}
      </View>
    );
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
    flex: 1,
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
  search: {
    // marginTop: 5,
    flex: 1,
    flexDirection: 'column',
    // paddingTop: 10,
    backgroundColor: '#fff',
  },
});

export default Chat;
