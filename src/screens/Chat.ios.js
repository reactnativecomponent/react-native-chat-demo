/*
 * @会话
 * @Author: huangjun
 * @Date: 2018-10-10 16:04:34
 * @Last Modified by: huangjun
 * @Last Modified time: 2020-04-19 16:05:41
 */

import React, {useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Clipboard,
  NativeAppEventEmitter,
  NativeModules,
  Image,
  LayoutAnimation,
} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {NimSession, NimFriend} from 'react-native-netease-im';
import ImagePicker from 'react-native-image-crop-picker';
import {ChatInput, MessageList} from 'react-native-imui';
import {RNToasty} from 'react-native-toasty';
import Svgs from '../components/Svgs';

const AuroraIController = NativeModules.AuroraIMUIModule;

const window = Dimensions.get('window');
export default function ChatIosScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {session = {}, title} = route.params || {};
  // 会话详情
  const _toSessionDetail = React.useCallback(() => {
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

  const [inputViewHeight, setInputViewHeight] = React.useState(50);
  const [showType, setShowType] = React.useState(0);
  const [menuViewH, setMenuViewH] = React.useState(220);
  const [viewY, setViewY] = React.useState(50);
  const [messages, setMessages] = React.useState([]);
  let _isAutoScroll = useRef(false);
  let _isListenKeyBoard = useRef(true);
  let _lastMessage = useRef();

  React.useEffect(() => {
    NimSession.startSession(session.contactId, session.sessionType);
    NimSession.queryMessageListEx('', 20).then(
      (data) => {
        _lastMessage.current = data[0];
        setMessages(data);
      },
      (err) => {
        console.log(err);
      },
    );
    const _sessionListener = NativeAppEventEmitter.addListener(
      'observeReceiveMessage',
      (data) => {
        if (data && data.length > 0) {
          AuroraIController.appendMessages(data);
          if (_isAutoScroll.current) {
            AuroraIController.scrollToBottom(true);
          }
        }
      },
    );
    const _msgStatusListener = NativeAppEventEmitter.addListener(
      'observeMsgStatus',
      (data) => {
        if (data[0].status === 'send_going') {
          // 发送中
          AuroraIController.appendMessages(data);
          AuroraIController.scrollToBottom(true);
        } else {
          AuroraIController.updateMessage(data[0]);
        }
        _isAutoScroll.current = true;
      },
    );
    const _focusListener = navigation.addListener('focus', () => {
      _isListenKeyBoard.current = true;
    });
    const _blurListener = navigation.addListener('blur', () => {
      _isListenKeyBoard.current = false;
    });
    return () => {
      NimSession.stopSession();
      AuroraIController.stopPlayVoice();
      _sessionListener.remove();
      _msgStatusListener.remove();
      navigation.removeListener('focus', _focusListener);
      navigation.removeListener('blur', _blurListener);
    };
  }, [session, navigation]);
  const _onFeatureView = (height, type) => {
    requestAnimationFrame(() => {
      LayoutAnimation.configureNext({
        duration: 200,
        create: {
          type: LayoutAnimation.Types.keyboard,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
        delete: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
      });
      setInputViewHeight(height);
      setShowType(type);
    });
    console.log('onFeatureView', height);
  };
  const _onShowKeyboard = (height, type) => {
    if (_isListenKeyBoard.current) {
      requestAnimationFrame(() => {
        LayoutAnimation.configureNext({
          duration: 200,
          create: {
            type: LayoutAnimation.Types.keyboard,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.keyboard,
            property: LayoutAnimation.Properties.opacity,
          },
          delete: {
            type: LayoutAnimation.Types.keyboard,
            property: LayoutAnimation.Properties.opacity,
          },
        });
        setInputViewHeight(height);
        setShowType(type);
      });
    }
  };
  const _onSendTextMessage = (text, ids) => {
    NimSession.sendTextMessage(text, ids);
  };
  const _onSendRecordMessage = (path) => {
    NimSession.sendAudioMessage(path, '0');
  };
  // @姓名
  const _onClickMention = () => {
    if (session.sessionType === '1') {
      navigation.push('RemindList', {
        session,
        onResult: function (res) {
          AuroraIController.clickGetAtPerson(res);
        },
      });
    }
  };

  const _onMsgClick = (message) => {
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

  const _onDealWithMenuClick = (message, strMenu) => {
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
  const _onStatusViewClick = (message) => {
    console.log('onStatusViewClick:', message);
  };

  const _onBeginDragMessageList = () => {
    AuroraIController.hidenFeatureView(true);
  };
  const _handleImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  const _handleCameraPicker = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      loadingLabelText: '请稍候...',
    }).then((image) => {
      NimSession.sendImageMessages(image.path, 'myName');
    });
  };
  const _handleLocationClick = () => {
    navigation.push('LocationPicker', {
      onLocation: (coordinate) => {
        NimSession.sendLocationMessage(
          coordinate.latitude,
          coordinate.longitude,
          coordinate.address,
        );
      },
    });
  };
  const _handleTransferClick = () => {
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  const _handleCustomMessageClick = () => {
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

  const _handlePacketClick = () => {
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  const _onMsgOpenUrlClick = (url) => {
    RNToasty.Show({
      title: `打开链接${url}`,
    });
  };

  const _onPacketPress = (message) => {
    console.log(message);
    RNToasty.Show({
      title: '需要自行实现',
    });
  };
  const _onAvatarPress = (v) => {
    if (v && v.fromUser) {
      NimFriend.getUserInfo(v.fromUser._id).then((data) => {
        navigation.push('FriendDetail', {
          friendData: data,
        });
      });
    }
  };

  const _onClickChangeAutoScroll = (isAutoScroll) => {
    _isAutoScroll.current = isAutoScroll;
  };
  const _loadMoreContentAsync = async () => {
    if (!_lastMessage.current) {
      return;
    }
    NimSession.queryMessageListEx(_lastMessage.current?.msgId, 20)
      .then((data) => {
        _lastMessage.current = data[data.length - 1];
        AuroraIController.insertMessagesToTop(data);
        AuroraIController.stopPlayActivity();
      })
      .catch((e) => {
        AuroraIController.stopPlayActivity();
      });
  };

  const _renderActions = () => {
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
        <View style={[styles.actionCol]}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={_handleCustomMessageClick}>
            {Svgs.iconTransfer}
          </TouchableOpacity>
          <Text style={{marginTop: 6, fontSize: 12}}>自定义消息</Text>
        </View>
      </View>
    );
  };

  const _renderCustomContent = () => {
    if (showType === 1) {
      // 显示菜单
      return (
        <View
          style={{
            height: menuViewH,
            width: window.width,
            marginTop: viewY,
            flexGrow: 1,
            backgroundColor: 'white',
          }}>
          <View style={{height: 1, backgroundColor: '#EAEAEA'}} />
          {_renderActions()}
        </View>
      );
    }
    return null;
  };
  return (
    <View flex>
      <MessageList
        style={styles.messageList}
        initalData={messages}
        onAvatarClick={_onAvatarPress}
        onMsgClick={_onMsgClick}
        onMsgOpenUrlClick={_onMsgOpenUrlClick}
        onDealWithMenuClick={_onDealWithMenuClick}
        onStatusViewClick={_onStatusViewClick}
        // onTapMessageCell={_onTapMessageCell}
        onClickChangeAutoScroll={_onClickChangeAutoScroll}
        onBeginDragMessageList={_onBeginDragMessageList}
        onClickLoadMessages={_loadMoreContentAsync}
        avatarSize={{width: 40, height: 40}}
        sendBubbleTextSize={18}
        sendBubbleTextColor="000000"
      />
      <SafeAreaView forceInset={{top: false}}>
        <ChatInput
          style={{
            width: window.width,
            height: inputViewHeight,
          }}
          menuViewH={menuViewH}
          defaultToolHeight={50}
          onFeatureView={_onFeatureView}
          onShowKeyboard={_onShowKeyboard}
          onSendTextMessage={_onSendTextMessage}
          onSendRecordMessage={_onSendRecordMessage}
          onClickMention={_onClickMention}>
          {_renderCustomContent()}
        </ChatInput>
      </SafeAreaView>
      {/* <NavigationEvents
            onWillFocus={(payload) => (this._isListenKeyBoard = true)}
            onWillBlur={(payload) => (this._isListenKeyBoard = false)}
          /> */}
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
