/*
 * @Descripttion: 新的朋友
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:50:38
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  NativeAppEventEmitter,
  FlatList,
} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {NimSystemMsg, NimFriend} from 'react-native-netease-im';
import {useNavigation} from '@react-navigation/native';
import {RNToasty} from 'react-native-toasty';
import {HeaderButtons} from 'react-navigation-header-buttons';
import Cell from '../components/Cell';

export default function NewFriendScreen() {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            title="查找"
            color="#037aff"
            onPress={() => navigation.push('SearchScreen')}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [dataList, setDataList] = React.useState([]);
  React.useEffect(() => {
    NimSystemMsg.startSystemMsg();
    const _systemMsgListener = NativeAppEventEmitter.addListener(
      'observeReceiveSystemMsg',
      (data) => {
        setDataList(data);
      },
    );
    return () => {
      NimSystemMsg.stopSystemMsg();
      _systemMsgListener.remove();
    };
  }, []);

  const _toFriendDetail = (res) => {
    NimFriend.fetchUserInfo(res.fromAccount).then((data) => {
      navigation.push('FriendDetail', {
        friendData: data,
        isRequest: res.status !== '1',
      });
    });
  };
  const _delete = (res) => {
    NimSystemMsg.ackAddFriendRequest(
      res.messageId,
      res.fromAccount,
      '0',
      res.time,
    ).then(() => {
      RNToasty.Show({
        title: '拒绝了添加',
      });
    });
  };
  const _accect = (res) => {
    NimSystemMsg.ackAddFriendRequest(
      res.messageId,
      res.fromAccount,
      '1',
      res.time,
    ).then(
      () => {
        RNToasty.Show({
          title: '添加成功',
        });
      },
      (err) => {
        console.log(err);
      },
    );
  };
  const _renderRow = ({item}) => (
    <Cell
      source={
        item.avatar ? {uri: item.avatar} : require('../images/discuss_logo.png')
      }
      iconLeftStyle={{width: 35, height: 35}}
      title={item.name}
      desc={item.verifyText}
      onPress={() => _toFriendDetail(item)}
      renderRight={
        item.status === '0' ? (
          <TouchableOpacity
            style={{backgroundColor: '#d82617', borderRadius: 3, padding: 8}}
            onPress={() => _accect(item)}>
            <Text style={{color: '#fff', fontSize: 13}}>接受</Text>
          </TouchableOpacity>
        ) : (
          <Text grey40>已接受</Text>
        )
      }
    />
  );
  const _renderHiddenRow = (res) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteBtn}
        activeOpacity={1}
        onPress={() => _delete(res)}>
        <Text style={{color: '#fff'}}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      ref={(v) => (this.swList = v)}
      data={dataList}
      renderItem={_renderRow}
    />
  );
}
const styles = StyleSheet.create({
  deleteBtn: {
    height: 67,
    width: 75,
    backgroundColor: '#d82617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
