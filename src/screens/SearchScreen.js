/*
 * @Descripttion: 查找用户
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:48:16
 */

import * as React from 'react';
import {View} from 'react-native-ui-lib';
import {ScrollView, StyleSheet} from 'react-native';
import {NimFriend} from 'react-native-netease-im';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Cell from '../components/Cell';
import SearchBar from '../components/SearchBar';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [dataList, setDataList] = React.useState([]);

  const _search = (account) => {
    NimFriend.fetchUserInfo(account).then((res) => {
      const arr = [];
      arr.push(res);
      setDataList([res]);
    });
  };
  const _onSelectResult = (data) => {
    navigation.goBack();
    navigation.navigate('FriendDetail', {
      friendData: data,
    });
  };
  const _renderResult = () => {
    if (dataList.length > 0) {
      return dataList.map((res) => (
        <Cell
          key={res.contactId}
          title={res.name}
          source={
            res.avatar
              ? {uri: res.avatar}
              : require('../images/discuss_logo.png')
          }
          iconLeftStyle={{width: 35, height: 35}}
          onPress={() => _onSelectResult(res)}
        />
      ));
    }
    return null;
  };
  const inset = useSafeAreaInsets();
  return (
    <View flex style={{backgroundColor: '#f7f7f7'}}>
      <View
        style={{
          paddingTop: inset.top,
          backgroundColor: '#fff',
          height: inset.top + 44,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#eee',
        }}>
        <SearchBar
          onSubmit={_search}
          onChangeQuery={_search}
          onCancelPress={() => navigation.goBack()}
        />
      </View>

      <ScrollView>{_renderResult()}</ScrollView>
    </View>
  );
}
