/*
 * @Descripttion: 通讯录
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:53:58
 */

import React from 'react';
import {NativeAppEventEmitter, SectionList, StyleSheet} from 'react-native';
import {HeaderButtons} from 'react-navigation-header-buttons';
import {View, Text} from 'react-native-ui-lib';
import {NimFriend} from 'react-native-netease-im';
import {useNavigation} from '@react-navigation/native';
import Cell from '../components/Cell';

export default function FriendList() {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons color="#037aff">
          <HeaderButtons.Item
            title="添加"
            color="#037aff"
            onPress={() => navigation.push('SearchScreen')}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [dataList, setDataList] = React.useState([]);

  const _formatData = (data) => {
    const newObj = [];
    const h = transform(data).sort();
    h.map((res) => {
      newObj.push({
        title: res,
        data: data[res],
      });
    });
    console.log(newObj);
    return newObj;
  };
  React.useEffect(() => {
    NimFriend.startFriendList();
    const _friendListener = NativeAppEventEmitter.addListener(
      'observeFriend',
      (data) => {
        setDataList(_formatData(data));
      },
    );
    return () => {
      NimFriend.stopFriendList();
      _friendListener.remove();
    };
  }, []);

  const _toFriendDetail = (id) => {
    NimFriend.getUserInfo(id).then((data) => {
      navigation.push('FriendDetail', {
        friendData: data,
      });
    });
  };
  const _renderRow = ({item}) => (
    <Cell
      title={item.name}
      iconLeftStyle={{width: 35, height: 35, marginRight: 12}}
      source={
        item.avatar ? {uri: item.avatar} : require('../images/discuss_logo.png')
      }
      onPress={() => _toFriendDetail(item.contactId)}
    />
  );
  const _renderSectionHeader = ({section: {title}}) => (
    <View
      paddingL-15
      centerV
      bg-white
      style={{
        height: 38,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
      }}>
      <Text>{title}</Text>
    </View>
  );

  return (
    <SectionList
      style={{backgroundColor: '#fff'}}
      sections={dataList}
      renderItem={_renderRow}
      renderSectionHeader={_renderSectionHeader}
      keyExtractor={(item, index) => item + index}
      ListHeaderComponent={
        <Cell title="新的朋友" onPress={() => navigation.push('NewFriend')} />
      }
    />
  );
}
function transform(obj) {
  const arr = [];
  for (const item in obj) {
    arr.push(item);
  }
  arr.sort(mySorter);
  return arr;
}
function mySorter(a, b) {
  if (/^\d/.test(a) !== /^\D/.test(b)) {
    return a > b ? 1 : (a = b ? 0 : -1);
  }
  return a > b ? -1 : a === b ? 0 : 1;
}
