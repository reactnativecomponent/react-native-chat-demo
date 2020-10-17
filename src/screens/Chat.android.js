/*
 * @会话
 * @Author: huangjun
 * @Date: 2018-10-10 15:49:57
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:28:50
 */
import React, {useRef} from 'react';
import {
  Clipboard,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeAppEventEmitter,
  NativeModules,
  Image,
  Animated,
} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {RNToasty} from 'react-native-toasty';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {NimFriend, NimSession} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import {MessageList, ChatInput} from 'react-native-imui';
import Svgs from '../components/Svgs';

const ContainerHeightMax = 800;

const ChatInputHeightBg = '#ffffff';
const {AuroraIMUIModule} = NativeModules;
// const AnimatedImplementation = require('react-native/Libraries/Animated/src/AnimatedImplementation');

// const MessageListView = AnimatedImplementation.createAnimatedComponent(
//   MessageList,
// );
// const InputView = AnimatedImplementation.createAnimatedComponent(ChatInput);

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {session = {}, title} = route.params || {};

  // 会话详情
  const _toSessionDetail = React.useCallback(() => {
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
  }, [navigation, session]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons>
          <HeaderButtons.Item
            ButtonElement={
              <Image
                style={{tintColor: '#037aff'}}
                source={
                  session?.sessionType === '1'
                    ? require('../images/session_team.png')
                    : require('../images/session_user.png')
                }
              />
            }
            title=""
            buttonWrapperStyle={{marginRight: 5}}
            onPress={_toSessionDetail}
          />
        </HeaderButtons>
      ),
    });
  }, [title, session, navigation, _toSessionDetail]);

  const [menuContainerHeight, setMenuContainerHeight] = React.useState(
    ContainerHeightMax,
  );
  const [chatInputStyle, setChatInputStyle] = React.useState({
    backgroundColor: ChatInputHeightBg,
    width,
  });
  const [chatInputheight, setChatInputheight] = React.useState(48);
  const [isDismissMenuContainer, setIsDismissMenuContainer] = React.useState(
    false,
  );
  const [initList, setInitList] = React.useState([]);
  const [action, setAction] = React.useState();

  let _lastMessage = useRef();

  React.useEffect(() => {
    NimSession.startSession(session.contactId, session.sessionType);
    const _sessionListener = NativeAppEventEmitter.addListener(
      'observeReceiveMessage',
      (data) => {
        console.info('新消息通知', data);
        if (data && data.length > 0) {
          AuroraIMUIModule.appendMessages(data);
          AuroraIMUIModule.scrollToBottom();
        }
      },
    );
    const _msgStatusListener = NativeAppEventEmitter.addListener(
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
    const _deleteMessageListener = NativeAppEventEmitter.addListener(
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
          _lastMessage.current = first;
          setInitList(data);
          AuroraIMUIModule.scrollToBottom();
        }
      },
      (err) => {
        console.log(err);
      },
    );
    return () => {
      NimSession.stopSession();
      _sessionListener.remove();
      _msgStatusListener.remove();
      _deleteMessageListener.remove();
    };
  }, [session]);
  const _loadMoreContentAsync = () => {
    if (!_lastMessage.current) {
      return;
    }
    NimSession.queryMessageListEx(_lastMessage.current?.msgId, 20).then(
      (data) => {
        if (data.length > 0) {
          const [first] = data;
          _lastMessage.current = first;
          AuroraIMUIModule.insertMessagesToTop(data);
        }
      },
    );
  };

  const _onSendText = (text, ids = []) => {
    let t = text;
    if (!t || !t.trim()) {
      RNToasty.Show({
        title: '请输入聊天内容',
      });
      return;
    }
    t = text.trim();
    NimSession.sendTextMessage(t, ids);

    // this.forceUpdate();
  };
  const _sendLocationImage = (longitude, latitude, address) => {
    NimSession.sendLocationMessage(longitude, latitude, address);
  };
  const _onLocation = (coordinate) => {
    _sendLocationImage(
      coordinate.longitude,
      coordinate.latitude,
      coordinate.address,
    );
  };
  // 语音消息
  const _onSendRecordMessage = (path, duration) => {
    NimSession.sendAudioMessage(path, duration);
  };
  // 打开相册照片
  const _handleImagePicker = () => {
    if (!action) {
      return;
    }
    ImagePicker.openPicker({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  // 打开相机拍照
  const _handleCameraPicker = () => {
    if (!action) {
      return;
    }
    ImagePicker.openCamera({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  // 选择位置
  const _handleLocationClick = () => {
    if (!action) {
      return;
    }
    navigation.push('LocationPicker', {
      onLocation: _onLocation,
    });
  };
  // 转账
  const _handleTransferClick = () => {
    if (!action) {
      return;
    }
    RNToasty.Show({
      title: '向好友转账',
    });
  };
  // 输入@监听
  const _onEditTextChange = (text) => {
    console.log('用于做@提醒:', text);
  };
  // 红包消息
  const _handlePacketClick = () => {
    if (!action) {
      return;
    }
    RNToasty.Show({
      title: '发红包',
    });
  };
  // 点击链接
  const _onOpenURL = (url) => {
    RNToasty.Show({
      title: `打开链接${url}`,
    });
  };
  // 点击红包消息
  const _onPacketPress = (message) => {
    console.log(message);
    RNToasty.Show({
      title: '红包详情',
    });
  };
  // 点击消息
  const _onMessagePress = (message) => {
    if (message.msgType === 'location') {
      navigation.push('LocationView', {
        region: message?.extend,
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
      _onPacketPress(message);
    }
  };

  // 点击头像
  const _onAvatarPress = (v) => {
    if (v && v.fromUser) {
      NimFriend.getUserInfo(v.fromUser._id).then((data) => {
        navigation.push('FriendDetail', {
          friendData: data,
        });
      });
    }
  };
  const _onTouchMsgList = () => {
    setChatInputheight(48);
    setChatInputStyle({
      backgroundColor: ChatInputHeightBg,
      width,
    });
    setIsDismissMenuContainer(true);
  };
  const _onFeatureView = (inputHeight, showType) => {
    setChatInputheight(showType > 0 ? 323 : 48);
    setAction(showType === 2);
    setIsDismissMenuContainer(false);
    setChatInputStyle({backgroundColor: ChatInputHeightBg, width});
    setMenuContainerHeight(ContainerHeightMax);

    setTimeout(() => {
      AuroraIMUIModule.scrollToBottom();
    }, 500);
  };
  const _onShowKeyboard = () => {
    setTimeout(() => {
      AuroraIMUIModule.scrollToBottom();
    }, 200);
  };
  // tip菜单
  const _onStatusViewClick = (message, opt) => {
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
  // 自定义输入功能
  const _renderActionBar = () => {
    return (
      <View style={styles.iconRow}>
        <View style={styles.actionCol}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={_handleCameraPicker}>
            {Svgs.iconCamera}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>拍照</Text>
        </View>
        <View style={styles.actionCol}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={_handleImagePicker}>
            {Svgs.iconImage}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>相册</Text>
        </View>
        <View style={[styles.actionCol]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={_handleLocationClick}>
            {Svgs.iconLocation}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>位置</Text>
        </View>
        <View style={[styles.actionCol, {marginRight: 0}]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={_handlePacketClick}>
            {Svgs.iconPack}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>红包</Text>
        </View>
        {session.sessionType === '0' ? (
          <View style={[styles.actionCol]}>
            <TouchableOpacity
              style={styles.iconTouch}
              onPress={_handleTransferClick}>
              {Svgs.iconTransfer}
            </TouchableOpacity>
            <Text style={{marginTop: 6, fontSize: 12}}>转账</Text>
          </View>
        ) : null}
      </View>
    );
  };
  return (
    <View flex>
      <MessageList
        style={{flex: 1}}
        onMsgClick={_onMessagePress}
        onLinkClick={_onOpenURL}
        onAvatarClick={_onAvatarPress}
        onStatusViewClick={_onStatusViewClick}
        onTouchMsgList={_onTouchMsgList}
        // onClickChangeAutoScroll={_onClickChangeAutoScroll}
        onPullToRefresh={_loadMoreContentAsync}
        sendBubble={{imageName: 'send_msg', padding: 10}}
        receiveBubbleTextColor="#ffffff"
        sendBubbleTextSize={14}
        receiveBubbleTextSize={14}
        sendBubblePressedColor="#dddddd"
        eventMsgTxtColor="#ffffff"
        eventMsgTxtSize={12}
        initList={initList}
      />
      <ChatInput
        style={[chatInputStyle, {height: chatInputheight}]}
        menuContainerHeight={menuContainerHeight}
        isDismissMenuContainer={isDismissMenuContainer}
        onSendText={_onSendText}
        onSendVoice={_onSendRecordMessage}
        onShowKeyboard={_onShowKeyboard}
        onFeatureView={_onFeatureView}
        onEditTextChange={_onEditTextChange}>
        <View style={styles.search}>{_renderActionBar()}</View>
      </ChatInput>
    </View>
  );
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
