/*
 * @Descripttion: 群组会话详情
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:28:24
 */

import * as React from 'react';
import {Image, StyleSheet, Switch, ScrollView, Dimensions} from 'react-native';
import {View, TouchableOpacity, Text} from 'react-native-ui-lib';
import {NimTeam, NimFriend, NimSession} from 'react-native-netease-im';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Cell from '../components/Cell';

export default function SessionTeamDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const {session = {}, onResult} = route.params || {};

  const [teamInfo, setTeamInfo] = React.useState({});
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    NimTeam.getTeamInfo(session.contactId).then((data) => {
      setTeamInfo(data);
    });
    NimTeam.fetchTeamMemberList(session.contactId).then((data) => {
      navigation.setOptions({
        title: `聊天信息(${data.length})`,
      });
      setMembers(data);
    });
  }, [navigation, session]);

  // 移出用户
  const _removeUser = () => {
    navigation.push('RemoveUsers', {
      members,
      teamId: session.contactId,
    });
  };
  // 邀请用户
  const _addUserToTeam = () => {
    navigation.push('SelectUsers', {
      members: members,
      teamId: session.contactId,
    });
  };
  const _toFriendDetail = (id) => {
    NimFriend.getUserInfo(id).then((data) => {
      navigation.push('FriendDetail', {
        friendData: data,
      });
    });
  };
  const _renderMembers = () => {
    if (members && members.length > 0) {
      return members.map((res) => (
        <View key={res.contactId}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.member}
            onPress={() => _toFriendDetail(res.contactId)}>
            <Image
              source={
                res.avatar ? {uri: res.avatar} : require('../images/head.png')
              }
              style={styles.avatar}
            />
            <Text style={{fontSize: 11, marginTop: 5}} note numberOfLines={1}>
              {res.alias || res.name}
            </Text>
          </TouchableOpacity>
        </View>
      ));
    }
    return null;
  };

  const _changeState = (v) => {
    if (v) {
      NimTeam.setTeamNotify(session.contactId, '0').then(() => {
        setTeamInfo({
          ...teamInfo,
          mute: '0',
        });
      });
    } else {
      NimTeam.setTeamNotify(session.contactId, '1').then(() => {
        setTeamInfo({
          ...teamInfo,
          mute: '1',
        });
      });
    }
  };
  const _updateTeamName = () => {
    navigation.push('UpdateTeamName', {
      teamData: teamInfo,
      onResult: () => {
        NimTeam.getTeamInfo(session.contactId).then((data) => {
          setTeamInfo(data);
        });
      },
    });
  };
  const _clearMessage = () => {
    NimSession.clearMessage(session.contactId, '1');
    onResult && onResult();
  };

  const deleteAction = (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.member}
      onPress={() => _removeUser()}>
      <Icon name="ios-remove" style={{fontSize: 45, color: '#666666'}} />
    </TouchableOpacity>
  );
  return (
    <View flex style={{backgroundColor: '#f7f7f7'}}>
      <ScrollView>
        <View style={styles.membersWarp}>
          {_renderMembers()}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.member}
            onPress={() => _addUserToTeam()}>
            <Icon name="ios-add" style={{fontSize: 45, color: '#666666'}} />
          </TouchableOpacity>
          {global.imaccount === teamInfo.creator ? deleteAction : null}
        </View>
        <Cell
          containerStyle={{marginTop: 12}}
          title="群聊名称"
          value={teamInfo.name}
          onPress={_updateTeamName}
        />
        <Cell
          title="消息免打扰"
          border={false}
          renderRight={
            <Switch
              value={teamInfo.mute === '0'}
              onValueChange={(v) => _changeState(v)}
            />
          }
        />
        <Cell
          border={false}
          containerStyle={{marginTop: 12}}
          title="清空聊天信息"
          onPress={_clearMessage}
        />
      </ScrollView>
    </View>
  );
}
const {width} = Dimensions.get('window');
const maxCount = ((width - 24) % 70) / 2;
const styles = StyleSheet.create({
  membersWarp: {
    backgroundColor: '#fff',
    padding: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: maxCount + 12,
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
  deleteBtn: {
    position: 'absolute',
    top: -3,
    left: 8,
    backgroundColor: 'transparent',
  },
});
