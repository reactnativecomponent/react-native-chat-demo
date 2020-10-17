/*
 * @Descripttion: 用户信息
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:38:35
 */

import * as React from 'react';
import {ScrollView} from 'react-native';
import {View, Button} from 'react-native-ui-lib';
import {NimFriend} from 'react-native-netease-im';
import {useNavigation, useRoute} from '@react-navigation/native';
import Cell from '../components/Cell';

export default function FriendDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const friendData = route.params?.friendData || {};
  const _toChat = () => {
    navigation.popToTop();
    const session = {
      ...friendData,
      sessionType: '0',
    };
    navigation.push('Chat', {
      title: session.alias || session.name,
      session,
    });
  };
  const _submitRequest = () => {
    NimFriend.ackAddFriendRequest(friendData.contactId, true).then(() => {
      navigation.pop();
    });
  };
  const _renderButton = () => {
    if (global.imaccount === friendData.contactId) {
      return null;
    }
    if (route.params?.isRequest) {
      return <Button label="通过验证" onPress={_submitRequest} />;
    }
    if (friendData.isMyFriend === '0') {
      return (
        <Button
          label="添加到通讯录"
          onPress={() =>
            navigation.push('SendAddFriend', {
              friendData,
            })
          }
        />
      );
    }
    return <Button label="发消息" onPress={_toChat} />;
  };
  const _renderRemark = () => {
    if (/^\d{5}$/.test(friendData.contactId)) {
      return (
        <ScrollView contentContainerStyle={{paddingTop: 12}}>
          <Cell
            border={false}
            title={friendData.name}
            iconLeftStyle={{width: 49, height: 49, borderRadius: 10}}
            source={
              friendData.avatar
                ? {uri: friendData.avatar}
                : require('../images/head.png')
            }
          />

          <Cell
            border={false}
            containerStyle={{marginTop: 12}}
            title="功能介绍"
            value="飞马钱包官方帐号"
          />
        </ScrollView>
      );
    }
    return (
      <ScrollView>
        <Cell
          title={friendData.name}
          containerStyle={{height: 80}}
          iconLeftStyle={{
            width: 49,
            height: 49,
            borderRadius: 10,
            marginRight: 12,
          }}
          source={
            friendData.avatar
              ? {uri: friendData.avatar}
              : require('../images/head.png')
          }
          desc={friendData.alias ? `昵称 : ${friendData.name}` : null}
        />
        <Cell
          border={false}
          title="设置备注"
          onPress={() => console.log('设置备注')}
        />

        <View paddingH-15 marginT-30>
          {_renderButton()}
        </View>
      </ScrollView>
    );
  };

  return (
    <View flex style={{backgroundColor: '#f7f7f7'}}>
      {_renderRemark()}
    </View>
  );
}
