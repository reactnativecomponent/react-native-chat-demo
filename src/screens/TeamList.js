/*
 * @Descripttion: 群组列表
 * @Author: huangjun
 * @Date: 2020-05-19 09:44:33
 * @LastEditors: huangjun
 * @LastEditTime: 2020-10-17 15:53:08
 */

import React from 'react';
import {NativeAppEventEmitter, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NimTeam} from 'react-native-netease-im';
import Cell from '../components/Cell';

export default function TeamListScreen() {
  const navigation = useNavigation();
  const [dataList, setDataList] = React.useState([]);
  React.useEffect(() => {
    NimTeam.startTeamList();
    const _teamListener = NativeAppEventEmitter.addListener(
      'observeTeam',
      (data) => {
        setDataList(data);
      },
    );
    return () => {
      NimTeam.stopTeamList();
      _teamListener.remove();
    };
  }, []);

  const _toChat = (res) => {
    navigation.popToTop();
    const session = {
      ...res,
      sessionType: '1',
      contactId: res.teamId,
    };
    navigator.push('Chat', {
      session,
      title: res.name,
    });
  };
  const _renderRow = ({item}) => (
    <Cell
      title={item.name}
      iconLeftStyle={{width: 35, height: 35}}
      source={
        item.avatar
          ? {uri: item.avatar}
          : require('../../images/discuss_logo.png')
      }
      onPress={() => _toChat(item)}
    />
  );

  return (
    <FlatList
      contentContainerStyle={{backgroundColor: '#fff'}}
      data={dataList}
      renderItem={_renderRow}
      keyExtractor={(item, index) => item + index}
    />
  );
}
