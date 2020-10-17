/*
 * @Descripttion: 单聊会话详情
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:52:47
 */

import * as React from 'react';
import {Image, ScrollView, StyleSheet, Switch} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native-ui-lib';
import {NimSession, NimFriend, NimTeam} from 'react-native-netease-im';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Cell from '../components/Cell';

export default function SessionUserDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {session = {}, onResult} = route.params || {};
  const [userInfo, setUserInfo] = React.useState({});

  React.useEffect(() => {
    NimFriend.getUserInfo(session.contactId).then((data) => {
      setUserInfo(data);
    });
  }, [session]);

  const _addUserToTeam = () => {
    navigation.push('CreateTeam', {
      members: [userInfo],
      onSuccess: (res) => {
        navigation.popToTop();
        navigation.push('Chat', {
          session: {
            contactId: res.teamId,
            name: '群聊',
            sessionType: '1',
          },
        });
      },
    });
  };
  const _changeState = (v) => {
    if (v) {
      NimTeam.setMessageNotify(session.contactId, '0').then((res) => {
        setUserInfo({
          ...userInfo,
          mute: '0',
        });
      });
    } else {
      NimTeam.setMessageNotify(session.contactId, '1').then((res) => {
        setUserInfo({
          ...userInfo,
          mute: '1',
        });
      });
    }
  };
  const _clearMessage = () => {
    NimSession.clearMessage(session.contactId, '0');
    onResult && onResult();
  };

  return (
    <View flex style={{backgroundColor: '#f7f7f7'}}>
      <ScrollView>
        <View style={styles.membersWarp}>
          <TouchableOpacity activeOpacity={1} style={styles.member}>
            <Image
              source={
                userInfo.avatar
                  ? {uri: userInfo.avatar}
                  : require('../images/head.png')
              }
              style={styles.avatar}
            />
            <Text style={{fontSize: 11, marginTop: 5}} note numberOfLines={1}>
              {userInfo.alias || userInfo.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.member}
            onPress={_addUserToTeam}>
            <Icon name="ios-add" style={{fontSize: 45, color: '#666666'}} />
          </TouchableOpacity>
        </View>
        <Cell
          containerStyle={{marginTop: 12}}
          border={false}
          title="消息免打扰"
          renderRight={
            <Switch
              value={userInfo.mute === '0'}
              onValueChange={(v) => _changeState(v)}
            />
          }
        />
        <Cell
          containerStyle={{marginTop: 12}}
          title="清空聊天信息"
          border={false}
          onPress={_clearMessage}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  membersWarp: {
    backgroundColor: '#fff',
    padding: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  member: {
    width: 70,
    height: 85,
    alignItems: 'center',
    paddingVertical: 5,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
});
